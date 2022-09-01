import { Router } from "express";
import * as CardControllers from "../controllers/cardsControllers";
import * as CardMiddlewares from "../middlewares/cardsMiddleware";

export const cardsRouter = Router();

cardsRouter.post(
  "/cards/create",
  CardMiddlewares.validateCardCreation,
  CardControllers.createCard
);

cardsRouter.patch(
  "/cards/:cardId/activate",
  CardMiddlewares.validateCardActivation,
  CardControllers.activateCard
);

cardsRouter.patch(
  "/cards/:cardId/block",
  CardMiddlewares.validateCardBlockUnblock,
  CardControllers.blockCard
);

cardsRouter.patch(
  "/cards/:cardId/unblock",
  CardMiddlewares.validateCardBlockUnblock,
  CardControllers.unblockCard
);

cardsRouter.post(
  "/cards/:cardId/recharge",
  CardMiddlewares.validateCardRecharge,
  CardControllers.rechargeCard
);

cardsRouter.post(
  "/cards/:cardId/payment",
  CardMiddlewares.validateCardPayment,
  CardControllers.payCard
);

cardsRouter.get(
  "/cards/:cardId/balance",
  CardMiddlewares.validateCardBalance,
  CardControllers.getCardBalance
);
