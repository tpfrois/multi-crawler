import puppeteer from "puppeteer-extra";
import StealhPlugin from "puppeteer-extra-plugin-stealth";

import { Page } from "puppeteer";
import { MarketInput, Product } from "./marketProduct";
import { Browser } from "puppeteer";

interface IMarketStrategy {
  scrape(market: MarketInput): Promise<Product>;
}

export default abstract class MarketStrategy implements IMarketStrategy {
  abstract scrape(market: MarketInput): Promise<Product>;

  protected browser: Browser | undefined = undefined;

  public async getStealthPage(): Promise<Page> {
    puppeteer.use(StealhPlugin());

    this.browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-gpu"],
    });

    const page = await this.browser.newPage();
    await page.setRequestInterception(true);

    page.on("request", request => {
      if (["image", "stylesheet", "script"].includes(request.resourceType()))
        request.abort();
      else request.continue();
    });

    return page;
  }
}
