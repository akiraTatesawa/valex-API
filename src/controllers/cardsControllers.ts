/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from "express";
import { OnlinePaymentData } from "../interfaces/paymentInterfaces";
import * as CardsServices from "../services/cardsServices";
import { TransactionTypes } from "../types/cardTypes";

export async function createCard(
  req: Request<{}, {}, { cardType: TransactionTypes; employeeId: number }>,
  res: Response
) {
  const { employeeId, cardType } = req.body;
  const { API_KEY } = res.locals;

  await CardsServices.createNewCard(API_KEY, employeeId, cardType);

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

export async function getCardBalance(
  req: Request<{ cardId: string }>,
  res: Response
) {
  const { cardId } = req.params;

  const cardBalance = await CardsServices.getCardBalance(parseInt(cardId, 10));

  return res.send(cardBalance);
}

export async function buyFromBusiness(
  req: Request<
    {},
    {},
    { cardId: number; password: string; businessId: number; amount: number }
  >,
  res: Response
) {
  const { cardId, password, businessId, amount } = req.body;

  await CardsServices.buyFromBusiness(cardId, password, businessId, amount);

  return res.sendStatus(200);
}

export async function buyFromBusinessOnline(
  req: Request<{}, {}, OnlinePaymentData>,
  res: Response
) {
  await CardsServices.buyFromBusinessOnline(req.body);

  return res.sendStatus(200);
}

export async function createVirtualCard(
  req: Request<{}, {}, { originalCardId: number; password: string }>,
  res: Response
) {
  const { originalCardId, password } = req.body;

  const virtualCard = await CardsServices.createVirtualCard(
    originalCardId,
    password
  );

  return res.send(virtualCard);
}
