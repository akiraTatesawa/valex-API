import { TransactionTypes } from "../types/cardTypes";

export interface NewCard {
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

export interface Card extends NewCard {
  id: number;
}

export interface ResponseCard {
  cardId: number;
  number: string;
  cardholderName: string;
  securityCode: string;
  expirationDate: string;
  type: TransactionTypes;
}
