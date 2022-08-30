import { Request, Response } from "express";
import * as CardsServices from "../services/cardsServices";

export async function createCard(
  req: Request<{ employeeId: string }>,
  res: Response
) {
  const { employeeId } = req.params;
  const { API_KEY, cardType } = res.locals;

  const result = await CardsServices.createNewCard(
    API_KEY,
    parseInt(employeeId, 10),
    cardType
  );

  return res.send(result);
}
