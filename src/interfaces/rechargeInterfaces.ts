export interface Recharge {
  id: number;
  cardId: number;
  timestamp: Date;
  amount: number;
}

export interface FormattedRecharge {
  id: number;
  cardId: number;
  timestamp: string;
  amount: number;
}
