import { Router } from "express";
import { cardsRouter } from "./cardsRouter";
import { paymentsRouter } from "./paymentsRouter";
import { virtualCardsRouter } from "./virtualCardsRouter";

export const serverRouter = Router();

serverRouter.use(cardsRouter);
serverRouter.use(paymentsRouter);
serverRouter.use(virtualCardsRouter);
