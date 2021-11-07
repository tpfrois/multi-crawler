import IMarketStrategy from "types/IMarketStrategy";
import { MarketInput, Product } from "types/marketProduct";
import { AmericanasStrategy } from "./marketStrategies/AmericanasStrategy";

export class MarketFactory {
  private strategy: IMarketStrategy;

  constructor(domain: string) {
    switch (domain) {
      case "www.americanas.com.br":
        console.log("MARKET DETECTED: AMERICANAS");
        this.strategy = new AmericanasStrategy();
        break;
      default:
        throw new Error("Market not implemented");
    }
  }

  public async create(market: MarketInput): Promise<Product> {
    const product = await this.strategy.scrape(market);
    return product;
  }
}
