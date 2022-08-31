import { NextFunction, Request, Response } from "express";
import { CustomError } from "../classes/CustomError";
import {
  activationCardSchema,
  blockUnblockCardSchema,
  createCardSchema,
} from "../schemas/cardsSchemas";

export async function validateCardCreation(
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
    const message = error.details.map((detail) => detail.message).join("; ");
    throw new CustomError("error_bad_request", message);
  }

  res.locals.cardType = cardType;
  res.locals.API_KEY = API_KEY;

  return next();
}

export async function validateCardActivation(
  req: Request<{ cardId: string }, {}, { password: string; CVC: string }>,
  res: Response,
  next: NextFunction
) {
  const { password, CVC } = req.body;

  if (!password || !CVC) {
    throw new CustomError("error_bad_request", "Password or CVC missing");
  }

  const { error } = activationCardSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const message = error.details.map((detail) => detail.message).join("; ");
    throw new CustomError("error_bad_request", message);
  }

  return next();
}

export async function validateCardBlockUnblock(
  req: Request<{ cardId: string }, {}, { password: string }>,
  res: Response,
  next: NextFunction
) {
  const { password } = req.body;

  if (!password) {
    throw new CustomError("error_bad_request", "Password missing");
  }

  const { error } = blockUnblockCardSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join("; ");
    throw new CustomError("error_bad_request", message);
  }

  return next();
}
