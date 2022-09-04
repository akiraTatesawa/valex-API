import { Router } from "express";
import * as CardControllers from "../controllers/cardController";
import * as RechargeController from "../controllers/rechargeController";
import * as CardMiddlewares from "../middlewares/cardMiddleware";
import * as SchemaValidatorMiddleware from "../middlewares/schemaMiddleware";

export const cardsRouter = Router();

cardsRouter.post(
  "/cards/create",
  SchemaValidatorMiddleware.validateBody("create"),
  CardMiddlewares.validateApiKey,
  CardControllers.createCard
);

cardsRouter.patch(
  "/cards/:cardId/activate",
  SchemaValidatorMiddleware.validateBody("activation"),
  CardMiddlewares.validateCardId,
  CardMiddlewares.validateCardActivation,
  CardControllers.activateCard
);

cardsRouter.patch(
  "/cards/:cardId/block",
  SchemaValidatorMiddleware.validateBody("blockUnblock"),
  CardMiddlewares.validateCardId,
  CardMiddlewares.validateCardBlockUnblock,
  CardControllers.blockCard
);

cardsRouter.patch(
  "/cards/:cardId/unblock",
  SchemaValidatorMiddleware.validateBody("blockUnblock"),
  CardMiddlewares.validateCardId,
  CardMiddlewares.validateCardBlockUnblock,
  CardControllers.unblockCard
);

cardsRouter.post(
  "/cards/:cardId/recharge",
  SchemaValidatorMiddleware.validateBody("recharge"),
  CardMiddlewares.validateCardId,
  CardMiddlewares.validateApiKey,
  RechargeController.rechargeCard
);

cardsRouter.get(
  "/cards/:cardId/balance",
  CardMiddlewares.validateCardId,
  CardControllers.getCardBalance
);
