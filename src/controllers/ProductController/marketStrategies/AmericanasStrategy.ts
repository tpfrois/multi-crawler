import puppeteer from "puppeteer-extra";

import { realToNumber } from "../../../helpers/currencyToNumber";
import { MarketInput, Product } from "../../../types/marketProduct";
import MarketStrategy from "../../../types/IMarketStrategy";

export class AmericanasStrategy extends MarketStrategy {
  public async scrape(market: MarketInput): Promise<Product> {
    const page = await super.getStealthPage();

    await page.goto(market.url, { waitUntil: "networkidle2" });

    const [titleElement] = await page.$x(
      "//h1[contains(@class, 'product-title')]"
    );
    const title = await page.evaluate(
      titleElement => titleElement.textContent,
      titleElement
    );

    const outOfStockElement = await page.$x(
      "//h2[contains(text(), 'produto sem estoque')]"
    );
    const outOfStock = outOfStockElement.length > 0;

    let price = null;

    if (!outOfStock) {
      const priceElement = await page.$(".priceSales");
      const priceString = await page.evaluate(
        priceElement => priceElement.textContent,
        priceElement
      );
      price = realToNumber(priceString);
    }

    await page.screenshot({ path: "screenshot.png", fullPage: true });

    const [mainImageElement] = await page.$x(
      "//*[contains(@class, 'main-image')]//picture//source/@srcset"
    );
    const mainImage = await page.evaluate(
      mainImageElement => mainImageElement.textContent,
      mainImageElement
    );

    const secondaryImagesElements = await page.$x(
      "//div[contains (@class, 'thumb-gallery')]/div/@src"
    );
    const secondaryImagesPromises = secondaryImagesElements.map(
      async secondaryImageElement => {
        const image = await page.evaluate(
          secondaryImageElement => secondaryImageElement.textContent,
          secondaryImageElement
        );
        return image;
      }
    );
    const secondaryImages = await Promise.all(secondaryImagesPromises);

    const product: Product = {
      url: market.url,
      market_id: market.market.market_id,
      name: title,
      internal_id: "",
      primary_image: mainImage,
      secondary_images: secondaryImages,
      available_to_buy: !outOfStock,
      price: price,
    };

    await page.close();
    await this.browser?.close();

    return product;
  }
}
