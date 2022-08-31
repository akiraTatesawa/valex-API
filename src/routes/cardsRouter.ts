import { Router } from "express";
import { createCard } from "../controllers/cardsControllers";
import {
  validateCardActivation,
  validateReqCardCreation,
} from "../middlewares/cardsMiddleware";

export const cardsRouter = Router();

cardsRouter.post(
  "/employees/:employeeId/cards/:cardType/create",
  validateReqCardCreation,
  createCard
);

cardsRouter.post(
  "/employees/:employeeId/cards/:cardId/activate",
  validateCardActivation
);
