import dayjs from "dayjs";
import { Recharge } from "../interfaces/rechargeInterfaces";
import { PaymentWithBusinessName } from "../repositories/paymentRepository";

export interface CardUtilsInterface {
  setCardholderName: (employeeName: string) => string;
  setIsExpired: (expirationDate: string) => boolean;
  calcBalance: (
    recharges: Recharge[],
    transactions: PaymentWithBusinessName[]
  ) => number;
}

export class CardUtils implements CardUtilsInterface {
  setCardholderName(employeeName: string): string {
    const employeeNameArray: string[] = employeeName.split(" ");
    const cardholderNameArray: string[] = [];

    employeeNameArray.forEach((value, index, array) => {
      if (index === 0 || index === array.length - 1) {
        return cardholderNameArray.push(value.toUpperCase());
      }
      if (value.length > 3) {
        return cardholderNameArray.push(value.charAt(0).toUpperCase());
      }
      return null;
    });

    return cardholderNameArray.join(" ");
  }

  setIsExpired(expirationDate: string): boolean {
    const formattedExpirationDate = expirationDate.replace("/", "-01-");

    if (dayjs().isAfter(dayjs(formattedExpirationDate))) {
      return true;
    }
    return false;
  }

  calcBalance(
    recharges: Recharge[],
    transactions: PaymentWithBusinessName[]
  ): number {
    const balance =
      recharges.reduce((prev, curr) => prev + curr.amount, 0) -
      transactions.reduce((prev, curr) => prev + curr.amount, 0);

    return balance;
  }
}
