import { Router } from "express";
import * as CardControllers from "../controllers/cardsControllers";
import * as CardMiddlewares from "../middlewares/cardsMiddleware";
import * as SchemaValidatorMiddleware from "../middlewares/schemaMiddleware";

export const cardsRouter = Router();

cardsRouter.post(
  "/cards/create",
  SchemaValidatorMiddleware.validateBody("create"),
  CardMiddlewares.validateCardCreation,
  CardControllers.createCard
);

cardsRouter.patch(
  "/cards/:cardId/activate",
  SchemaValidatorMiddleware.validateBody("activation"),
  CardMiddlewares.validateCardActivation,
  CardControllers.activateCard
);

cardsRouter.patch(
  "/cards/:cardId/block",
  SchemaValidatorMiddleware.validateBody("blockUnblock"),
  CardMiddlewares.validateCardBlockUnblock,
  CardControllers.blockCard
);

cardsRouter.patch(
  "/cards/:cardId/unblock",
  SchemaValidatorMiddleware.validateBody("blockUnblock"),
  CardMiddlewares.validateCardBlockUnblock,
  CardControllers.unblockCard
);

cardsRouter.post(
  "/cards/:cardId/recharge",
  SchemaValidatorMiddleware.validateBody("recharge"),
  CardMiddlewares.validateCardRecharge,
  CardControllers.rechargeCard
);

cardsRouter.post(
  "/cards/:cardId/payment",
  SchemaValidatorMiddleware.validateBody("payment"),
  CardMiddlewares.validateCardPayment,
  CardControllers.payCard
);

cardsRouter.get(
  "/cards/:cardId/balance",
  CardMiddlewares.validateCardBalance,
  CardControllers.getCardBalance
);
