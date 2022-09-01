import { Router } from "express";
import {
  activateCard,
  blockCard,
  createCard,
  getCardBalance,
  rechargeCard,
  unblockCard,
} from "../controllers/cardsControllers";
import {
  validateCardActivation,
  validateCardBalance,
  validateCardBlockUnblock,
  validateCardCreation,
  validateCardRecharge,
} from "../middlewares/cardsMiddleware";

export const cardsRouter = Router();

cardsRouter.post(
  "/employees/:employeeId/cards/:cardType/create",
  validateCardCreation,
  createCard
);

cardsRouter.patch(
  "/cards/:cardId/activate",
  validateCardActivation,
  activateCard
);

cardsRouter.patch("/cards/:cardId/block", validateCardBlockUnblock, blockCard);

cardsRouter.patch(
  "/cards/:cardId/unblock",
  validateCardBlockUnblock,
  unblockCard
);

cardsRouter.post("/cards/:cardId/recharge", validateCardRecharge, rechargeCard);

cardsRouter.get("/cards/:cardId/balance", validateCardBalance, getCardBalance);
