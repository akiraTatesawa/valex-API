import { TransactionTypes } from "../types/cardTypes";

export interface Business {
  id: number;
  name: string;
  type: TransactionTypes;
}
