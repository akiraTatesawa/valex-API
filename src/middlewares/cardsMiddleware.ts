import { NextFunction, Request, Response } from "express";
import { createCardSchema } from "../schemas/cardsSchemas";

export async function validateReqCard(
  req: Request<{ cardType: string }>,
  res: Response,
  next: NextFunction
) {
  const { cardType } = req.params;
  const { "x-api-key": API_KEY } = req.headers;

  const { error } = createCardSchema.validate(
    { API_KEY, cardType },
    { abortEarly: false }
  );

  if (error) {
    return res.status(422).send(error.details.map((detail) => detail.message));
  }

  res.locals.cardType = cardType;
  res.locals.API_KEY = API_KEY;

  return next();
}
