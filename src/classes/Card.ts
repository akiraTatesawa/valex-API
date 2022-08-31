// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { TransactionTypes } from "../types/cardTypes";
import { encryptData } from "../utils/cryptDataUtils";

export class Card {
  employeeId: number;

  type: TransactionTypes;

  readonly number: string = faker.finance.creditCardNumber(
    "#### #### #### ####"
  );

  cardholderName: string;

  readonly securityCode: string = encryptData(faker.finance.creditCardCVV());

  readonly expirationDate: string = dayjs().add(5, "y").format("MM/YY");

  readonly password: string | undefined = undefined;

  readonly isVirtual: boolean = false;

  readonly originalCardId: number | undefined = undefined;

  readonly isBlocked: boolean = false;

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
