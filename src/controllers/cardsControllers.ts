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

export async function activateCard(
  req: Request<{ cardId: string }, {}, { password: string; CVC: string }>,
  res: Response
) {
  const { cardId } = req.params;
  const { password, CVC } = req.body;

  await CardsServices.activateCard(parseInt(cardId, 10), password, CVC);

  return res.sendStatus(200);
}

export async function blockCard(
  req: Request<{ cardId: string }, {}, { password: string }>,
  res: Response
) {
  const { cardId } = req.params;
  const { password } = req.body;

  await CardsServices.blockCard(parseInt(cardId, 10), password);

  return res.sendStatus(200);
}

export async function unblockCard(
  req: Request<{ cardId: string }, {}, { password: string }>,
  res: Response
) {
  const { cardId } = req.params;
  const { password } = req.body;

  await CardsServices.unblockCard(parseInt(cardId, 10), password);

  return res.sendStatus(200);
}

export async function rechargeCard(
  req: Request<{ cardId: string }, {}, { amount: number }>,
  res: Response
) {
  const { cardId } = req.params;
  const { amount } = req.body;
  const { API_KEY } = res.locals;

  await CardsServices.rechargeCard(parseInt(cardId, 10), API_KEY, amount);

  return res.sendStatus(201);
}
