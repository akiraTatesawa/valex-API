import { Router } from "express";
import * as PaymentController from "../controllers/paymentController";
import * as SchemaValidatorMiddleware from "../middlewares/schemaMiddleware";

export const paymentsRouter = Router();

paymentsRouter.post(
  "/payments/pos",
  SchemaValidatorMiddleware.validateBody("paymentPOS"),
  PaymentController.buyFromBusinessPOS
);

paymentsRouter.post(
  "/payments/online",
  SchemaValidatorMiddleware.validateBody("paymentOnline"),
  PaymentController.buyFromBusinessOnline
);
