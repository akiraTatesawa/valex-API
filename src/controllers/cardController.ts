/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from "express";
import { TransactionTypes } from "../types/cardTypes";
import {
  activateCardService,
  blockCardService,
  createCardService,
  getBalanceService,
  unblockCardService,
} from "../services/cardServices";

export async function createCard(
  req: Request<{}, {}, { cardType: TransactionTypes; employeeId: number }>,
  res: Response
) {
  const { employeeId, cardType } = req.body;
  const { API_KEY } = res.locals;

  const card = await createCardService.create(API_KEY, employeeId, cardType);

  return res.status(201).send(card);
}

export async function activateCard(
  req: Request<{ cardId: string }, {}, { password: string; CVC: string }>,
  res: Response
) {
  const { cardId } = req.params;
  const { password, CVC } = req.body;

  await activateCardService.execute(parseInt(cardId, 10), password, CVC);

  return res.sendStatus(200);
}

export async function blockCard(
  req: Request<{ cardId: string }, {}, { password: string }>,
  res: Response
) {
  const { cardId } = req.params;
  const { password } = req.body;

  await blockCardService.execute(parseInt(cardId, 10), password);

  return res.sendStatus(200);
}

export async function unblockCard(
  req: Request<{ cardId: string }, {}, { password: string }>,
  res: Response
) {
  const { cardId } = req.params;
  const { password } = req.body;

  await unblockCardService.execute(parseInt(cardId, 10), password);

  return res.sendStatus(200);
}
export async function getCardBalance(
  req: Request<{ cardId: string }>,
  res: Response
) {
  const { cardId } = req.params;

  const cardBalance = await getBalanceService.execute(parseInt(cardId, 10));

  return res.send(cardBalance);
}
