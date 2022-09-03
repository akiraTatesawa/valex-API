// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";
import { TransactionTypes } from "../types/cardTypes";
import { Card } from "./Card";

export class VirtualCard extends Card {
  readonly number: string = faker.finance.creditCardNumber("mastercard");

  readonly originalCardId: number | undefined = undefined;

  readonly isVirtual: boolean = true;

  constructor(
    employeeId: number,
    type: TransactionTypes,
    cardholderName: string,
    originalCardId: number
  ) {
    super(employeeId, type, cardholderName);
    this.originalCardId = originalCardId;
  }
}
