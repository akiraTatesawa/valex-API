/* eslint-disable @typescript-eslint/indent */
import { NextFunction, Request, Response } from "express";
import { CustomError } from "../classes/CustomError";
import { API_KEYSchema } from "../schemas/headerSchema";
import { TransactionTypes } from "../types/cardTypes";

export async function validateCardCreation(
  req: Request<{}, {}, { cardType: TransactionTypes; employeeId: number }>,
  res: Response,
  next: NextFunction
) {
  const { "x-api-key": API_KEY } = req.headers;

  const { error: headerError } = API_KEYSchema.validate(
    { API_KEY },
    { abortEarly: false }
  );

  if (headerError) {
    const message = headerError.details
      .map((detail) => detail.message)
      .join("; ");
    throw new CustomError("error_unprocessable_entity", message);
  }

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

  return next();
}

export async function validateCardRecharge(
  req: Request<{ cardId: string }, {}, { amount: number }>,
  res: Response,
  next: NextFunction
) {
  const { "x-api-key": API_KEY } = req.headers;

  const { error: headerError } = API_KEYSchema.validate(
    { API_KEY },
    { abortEarly: false }
  );

  if (headerError) {
    const message = headerError.details
      .map((detail) => detail.message)
      .join("; ");
    throw new CustomError("error_unprocessable_entity", message);
  }

  res.locals.API_KEY = API_KEY;

  return next();
}
export async function validateCardId(
  req: Request<{ cardId: string }>,
  _res: Response,
  next: NextFunction
) {
  const { cardId } = req.params;

  if (!cardId.match(/^\d+$/)) {
    throw new CustomError(
      "error_unprocessable_entity",
      "Card Id must be a number"
    );
  }

  return next();
}
