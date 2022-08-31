import { Router } from "express";
import { cardsRouter } from "./cardsRouter";

export const serverRouter = Router();

serverRouter.use(cardsRouter);
