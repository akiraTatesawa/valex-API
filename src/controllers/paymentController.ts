/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from "express";
import { OnlinePaymentData } from "../interfaces/paymentInterfaces";
import {
  onlinePaymentService,
  posPaymentService,
} from "../services/paymentServices";

export async function buyFromBusinessPOS(
  req: Request<
    {},
    {},
    { cardId: number; password: string; businessId: number; amount: number }
  >,
  res: Response
) {
  const { cardId, password, businessId, amount } = req.body;

  await posPaymentService.execute(cardId, password, businessId, amount);

  return res.sendStatus(200);
}

export async function buyFromBusinessOnline(
  req: Request<{}, {}, OnlinePaymentData>,
  res: Response
) {
  await onlinePaymentService.execute(req.body);

  return res.sendStatus(200);
}
