import { Router } from "express";
import { activateCard, createCard } from "../controllers/cardsControllers";
import {
  validateCardActivation,
  validateCardCreation,
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
