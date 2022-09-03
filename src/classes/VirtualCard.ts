/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";
import { TransactionTypes } from "../types/cardTypes";
import { Card } from "./Card";

export class VirtualCard extends Card {
  readonly number: string = faker.finance.creditCardNumber("mastercard");

  readonly isVirtual: boolean = false;

  readonly originalCardId: number | undefined = undefined;

  constructor(
    employeeId: number,
    type: TransactionTypes,
    cardholderName: string,
    isVirtual: boolean,
    originalCardId: number
  ) {
    super(employeeId, type, cardholderName);
    this.isVirtual = isVirtual;
    this.originalCardId = originalCardId;
  }
}
