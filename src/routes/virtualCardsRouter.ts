import { Router } from "express";
import * as CardControllers from "../controllers/cardsControllers";
// import * as CardMiddlewares from "../middlewares/cardsMiddleware";
import * as SchemaValidatorMiddleware from "../middlewares/schemaMiddleware";

export const virtualCardsRouter = Router();

// Create a virtual card
virtualCardsRouter.post(
  "/cards/virtual/create",
  SchemaValidatorMiddleware.validateBody("createVirtual"),
  CardControllers.createVirtualCard
);

// Delete a virtual card
virtualCardsRouter.delete(
  "/cards/virtual/delete",
  SchemaValidatorMiddleware.validateBody("deleteVirtual")
);
