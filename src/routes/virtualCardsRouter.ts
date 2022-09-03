import { Router } from "express";
import * as VirtualCardControllers from "../controllers/virtualCardController";
import * as SchemaValidatorMiddleware from "../middlewares/schemaMiddleware";

export const virtualCardsRouter = Router();

// Create a virtual card
virtualCardsRouter.post(
  "/cards/virtual/create",
  SchemaValidatorMiddleware.validateBody("createVirtual"),
  VirtualCardControllers.createVirtualCard
);

// Delete a virtual card
virtualCardsRouter.delete(
  "/cards/virtual/delete",
  SchemaValidatorMiddleware.validateBody("deleteVirtual"),
  VirtualCardControllers.deleteVirtualCard
);
