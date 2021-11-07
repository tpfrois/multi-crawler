import puppeteer from "puppeteer-extra";
import StealhPlugin from "puppeteer-extra-plugin-stealth";

import { Page } from "puppeteer";
import { MarketInput, Product } from "./marketProduct";

interface IMarketStrategy {
  scrape(market: MarketInput): Promise<Product>;
}

export default abstract class MarketStrategy implements IMarketStrategy {
  abstract scrape(market: MarketInput): Promise<Product>;

  public async getStealthPage(): Promise<Page> {
    puppeteer.use(StealhPlugin());

    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-gpu"],
    });

    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on("request", request => {
      if (
        request.resourceType() === "image" ||
        request.resourceType() === "stylesheet"
      )
        request.abort();
      else request.continue();
    });

    return page;
  }
}
