import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { CustomError } from "../classes/CustomError";
import {
  createCardSchema as create,
  activationCardSchema as activation,
  blockUnblockCardSchema as blockUnblock,
  paymentCardSchema as payment,
  rechargeCardSchema as recharge,
} from "../schemas/cardsSchemas";

interface SchemasInterface {
  [schemaName: string]: ObjectSchema;
}

type Validator =
  | "create"
  | "activation"
  | "blockUnblock"
  | "payment"
  | "recharge";

export function validateBody(validator: Validator) {
  const Schemas: SchemasInterface = {
    create,
    activation,
    blockUnblock,
    payment,
    recharge,
  };

  if (!Object.hasOwn(Schemas, validator)) {
    throw new CustomError(
      "error_internal_server_error",
      "Invalid schema validator"
    );
  }

  return (req: Request, _res: Response, next: NextFunction) => {
    const { error } = Schemas[validator].validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join("; ");
      throw new CustomError("error_unprocessable_entity", message);
    }

    return next();
  };
}
