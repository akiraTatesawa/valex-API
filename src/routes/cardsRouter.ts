import { Router } from "express";
import { validateReqCard } from "../middlewares/cardsMiddleware";

export const cardsRouter = Router();

cardsRouter.post("/employees/:employeeId/cards/:cardType", validateReqCard);
