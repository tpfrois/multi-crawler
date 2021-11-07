import express from "express";
import { errors } from "celebrate";

import productRouter from "./routes/product";

const app = express();

app.use(express.json());
app.use("/product", productRouter);
app.use(errors());

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
