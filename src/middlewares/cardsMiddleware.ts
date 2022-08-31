import { NextFunction, Request, Response } from "express";
import { CustomError } from "../classes/CustomError";
import {
  activationCardSchema,
  blockUnblockCardSchema,
  createCardSchema,
} from "../schemas/cardsSchemas";

export async function validateCardCreation(
  req: Request<{ cardType: string; employeeId: string }>,
  res: Response,
  next: NextFunction
) {
  const { cardType, employeeId } = req.params;
  const { "x-api-key": API_KEY } = req.headers;

  if (!employeeId.match(/^\d+$/)) {
    throw new CustomError(
      "error_unprocessable_entity",
      "Employee Id must be a number"
    );
  }

  const { error } = createCardSchema.validate(
    { API_KEY, cardType },
    { abortEarly: false }
  );

  if (error) {
    const message = error.details.map((detail) => detail.message).join("; ");
    throw new CustomError("error_unprocessable_entity", message);
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
  const { cardId } = req.params;

  if (!cardId.match(/^\d+$/)) {
    throw new CustomError(
      "error_unprocessable_entity",
      "Card Id must be a number"
    );
  }

  if (!password || !CVC) {
    throw new CustomError("error_bad_request", "Password or CVC missing");
  }

  const { error } = activationCardSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    const message = error.details.map((detail) => detail.message).join("; ");
    throw new CustomError("error_unprocessable_entity", message);
  }

  return next();
}

export async function validateCardBlockUnblock(
  req: Request<{ cardId: string }, {}, { password: string }>,
  res: Response,
  next: NextFunction
) {
  const { password } = req.body;
  const { cardId } = req.params;

  if (!cardId.match(/^\d+$/)) {
    throw new CustomError(
      "error_unprocessable_entity",
      "Card Id must be a number"
    );
  }

  if (!password) {
    throw new CustomError("error_bad_request", "Password missing");
  }

  const { error } = blockUnblockCardSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join("; ");
    throw new CustomError("error_unprocessable_entity", message);
  }

  return next();
}
