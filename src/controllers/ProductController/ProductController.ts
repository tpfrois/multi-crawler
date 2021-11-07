import { Request, Response } from "express";
import { MarketInput } from "types/marketProduct";
import extractDomain from "../../helpers/extractDomain";
import { MarketFactory } from "./MarketFactory";

export default class ProductController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { market, url } = req.body;
    const domain = extractDomain(url);

    const marketInput: MarketInput = {
      market: {
        name: market.name,
        fullname: market.fullname,
        use_browser: market.use_browser,
        market_id: market.market_id,
      },
      url,
    };

    try {
      const marketFactory = new MarketFactory(domain);
      const product = await marketFactory.create(marketInput);

      return res.json({ product });
    } catch (error) {
      console.error(error);
      let err = error as Error;
      if (err.message != "Market not implemented") {
        err.message =
          "Tivemos um problema ao extrair o produto, tente novamente mais tarde.";
      } else {
        err.message = "Loja não implementada.";
      }
      return res.status(400).json({ error: err.message });
    }
  }
}
