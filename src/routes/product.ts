import { Router } from "express";
import { celebrate, Joi, Segments } from "celebrate";
import ProductController from "../controllers/ProductController/ProductController";

const productRouter = Router();
const productController = new ProductController();

const bodySchema = Joi.object().keys({
  market: Joi.object().keys({
    use_browser: Joi.boolean(),
    name: Joi.string(),
    fullname: Joi.string(),
    market_id: Joi.number().required(),
  }),
  url: Joi.string().uri().required(),
});

productRouter.post(
  "/",
  celebrate({ [Segments.BODY]: bodySchema }),
  async (req, res) => {
    productController.create(req, res);
    // productController.create;
  }
);

export default productRouter;
