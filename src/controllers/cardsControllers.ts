import { Request, Response } from "express";
import * as CardsServices from "../services/cardsServices";
import { TransactionTypes } from "../types/cardTypes";

export async function createCard(
  req: Request<{ employeeId: string; cardType: TransactionTypes }>,
  res: Response
) {
  const { employeeId, cardType } = req.params;
  const { API_KEY } = res.locals;

  await CardsServices.createNewCard(
    API_KEY,
    parseInt(employeeId, 10),
    cardType
  );

  return res.sendStatus(201);
}
