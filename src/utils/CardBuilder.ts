import { TransactionTypes } from "../repositories/cardRepository";

export class Card {
  employeeId: number;

  number: string;

  cardholderName: string;

  securityCode: string;

  expirationDate: string;

  password?: string;

  isVirtual: boolean;

  originalCardId?: number;

  isBlocked: boolean;

  type: TransactionTypes;
}
