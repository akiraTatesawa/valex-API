// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";
import { TransactionTypes } from "../types/cardTypes";
import { CryptDataInterface } from "../utils/cryptDataUtils";
import { Card } from "./Card";

export class VirtualCard extends Card {
  readonly number: string;

  readonly originalCardId: number | undefined = undefined;

  readonly isVirtual: boolean = true;

  readonly password: string | undefined = undefined;

  constructor(
    employeeId: number,
    type: TransactionTypes,
    cardholderName: string,
    cryptDataUtils: CryptDataInterface,
    originalCardId: number,
    originalCardPassword: string | undefined
  ) {
    super(employeeId, type, cardholderName, cryptDataUtils);
    this.originalCardId = originalCardId;
    this.password = originalCardPassword;

    this.number = faker.finance.creditCardNumber("mastercard");
  }
}
