/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { NewCard as CardInterface } from "../interfaces/cardInterfaces";
import { TransactionTypes } from "../types/cardTypes";
import { encryptData } from "../utils/cryptDataUtils";

export class Card implements CardInterface {
  readonly employeeId: number;

  readonly type: TransactionTypes;

  readonly number: string = faker.finance.creditCardNumber(
    "####-####-####-####"
  );

  readonly cardholderName: string;

  readonly securityCode: string = encryptData(faker.finance.creditCardCVV());

  readonly expirationDate: string = dayjs().add(5, "y").format("MM/YY");

  readonly password: string | undefined = undefined;

  readonly isBlocked: boolean = false;

  readonly isVirtual: boolean = false;

  readonly originalCardId: number | undefined = undefined;

  constructor(
    employeeId: number,
    type: TransactionTypes,
    cardholderName: string
  ) {
    this.employeeId = employeeId;
    this.type = type;
    this.cardholderName = cardholderName;
  }
}
