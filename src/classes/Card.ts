/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { NewCard as CardInterface } from "../interfaces/cardInterfaces";
import { TransactionTypes } from "../types/cardTypes";
import { CryptDataInterface } from "../utils/cryptDataUtils";

export class Card implements CardInterface {
  readonly employeeId: number;

  readonly type: TransactionTypes;

  readonly number: string;

  readonly cardholderName: string;

  readonly securityCode: string;

  readonly expirationDate: string;

  readonly password: string | undefined = undefined;

  readonly isBlocked: boolean = false;

  readonly isVirtual: boolean = false;

  readonly originalCardId: number | undefined = undefined;

  constructor(
    employeeId: number,
    type: TransactionTypes,
    cardholderName: string,
    private cryptDataUtils: CryptDataInterface
  ) {
    this.employeeId = employeeId;
    this.type = type;
    this.cardholderName = cardholderName;
    this.cryptDataUtils = cryptDataUtils;

    this.securityCode = this.cryptDataUtils.encryptData(
      faker.finance.creditCardCVV()
    );

    this.expirationDate = dayjs().add(5, "y").format("MM/YY");

    this.number = faker.finance.creditCardNumber("####-####-####-####");
  }
}
