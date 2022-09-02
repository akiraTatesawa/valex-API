import { Router } from "express";
import * as CardControllers from "../controllers/cardsControllers";
import * as SchemaValidatorMiddleware from "../middlewares/schemaMiddleware";

export const paymentsRouter = Router();

paymentsRouter.post(
  "/payments/pos",
  SchemaValidatorMiddleware.validateBody("paymentPOS"),
  CardControllers.buyFromBusiness
);

paymentsRouter.post(
  "/payments/online",
  SchemaValidatorMiddleware.validateBody("paymentOnline")
);
