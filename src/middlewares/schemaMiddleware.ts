import { NextFunction, Request, Response } from "express";
import { CustomError } from "../classes/CustomError";
import {
  createCardSchema as create,
  activationCardSchema as activation,
  blockUnblockCardSchema as blockUnblock,
  rechargeCardSchema as recharge,
  createVirtualCardSchema as createVirtual,
  deleteVirtualCardSchema as deleteVirtual,
} from "../schemas/cardsSchemas";
import {
  paymentPOSSchema as paymentPOS,
  paymentOnlineSchema as paymentOnline,
} from "../schemas/paymentsSchemas";

const Schemas = {
  create,
  createVirtual,
  deleteVirtual,
  activation,
  blockUnblock,
  paymentPOS,
  paymentOnline,
  recharge,
};

type Validator = keyof typeof Schemas;

export function validateBody(
  validator: Validator
): (req: Request, _res: Response, next: NextFunction) => Promise<void> {
  if (!Object.hasOwn(Schemas, validator)) {
    throw new CustomError(
      "error_internal_server_error",
      "Invalid schema validator"
    );
  }

  return async (req: Request, _res: Response, next: NextFunction) => {
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
