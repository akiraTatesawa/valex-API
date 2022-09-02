export type TransactionTypes =
  | "groceries"
  | "restaurant"
  | "transport"
  | "education"
  | "health";

export type CardInfo = {
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
  CVC: string;
};
