import { Request, Response } from "express";
import { rechargeCardService } from "../services/cardServices";

export async function rechargeCard(
  req: Request<{ cardId: string }, {}, { amount: number }>,
  res: Response
) {
  const { cardId } = req.params;
  const { amount } = req.body;
  const { API_KEY } = res.locals;

  await rechargeCardService.execute(parseInt(cardId, 10), API_KEY, amount);

  return res.sendStatus(201);
}
