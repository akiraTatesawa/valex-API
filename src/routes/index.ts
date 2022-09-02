import { Router } from "express";
import { cardsRouter } from "./cardsRouter";
import { paymentsRouter } from "./paymentsRouter";

export const serverRouter = Router();

serverRouter.use(cardsRouter);
serverRouter.use(paymentsRouter);
