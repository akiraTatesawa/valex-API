import { CardInfo } from "../types/cardTypes";

export interface Payment {
  id: number;
  cardId: number;
  businessId: number;
  timestamp: Date;
  amount: number;
}

export interface OnlinePaymentData {
  cardInfo: CardInfo;
  businessId: number;
  amount: number;
}
