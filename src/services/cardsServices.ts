import * as CompanyRepository from "../repositories/companyRepository";
import * as EmployeeRepository from "../repositories/employeeRepository";
import * as CardRepository from "../repositories/cardRepository";
import * as RechargeRepository from "../repositories/rechargeRepository";
import * as PaymentRepository from "../repositories/paymentRepository";
import * as BusinessRepository from "../repositories/businessRepository";
import * as CardUtils from "../utils/cardUtils";
import * as CryptDataUtils from "../utils/cryptDataUtils";
import { CustomError } from "../classes/CustomError";
import { Card } from "../classes/Card";
import { TransactionTypes } from "../types/cardTypes";
import { Card as ICard } from "../interfaces/cardInterfaces";
import { Company } from "../interfaces/companyInterfaces";
import { Employee } from "../interfaces/employeeInterfaces";

const checkIfCompanyDoesNotExist = (company: Company) => {
  if (!company) throw new CustomError("error_not_found", "Company not found");
};
const checkIfEmployeeDoesNotExist = (employee: Employee) => {
  if (!employee) throw new CustomError("error_not_found", "Employee not found");
};
const checkIfEmployeeAlreadyHasTheCard = (card: ICard, cardType: string) => {
  if (card) {
    throw new CustomError(
      "error_conflict",
      `The employee already has a ${cardType} card`
    );
  }
};
const checkIfCardDoesNotExist = (card: ICard) => {
  if (!card) throw new CustomError("error_not_found", "Card not found");
};
const checkIfCardIsAlreadyActivated = (password: string | undefined) => {
  if (password) {
    throw new CustomError(
      "error_bad_request",
      "This card is already activated"
    );
  }
};
const checkIfCardIsExpired = (expirationDate: string) => {
  if (CardUtils.setIsExpired(expirationDate)) {
    throw new CustomError("error_bad_request", "This card is expired");
  }
};
const checkIfSecurityCodeIsWrong = (
  cardSecurityCode: string,
  reqCVC: string
) => {
  if (CryptDataUtils.decryptData(cardSecurityCode) !== reqCVC) {
    throw new CustomError("error_unauthorized", "Wrong card security code");
  }
};
const checkIfCardIsNotActivated = (password: string | undefined) => {
  if (!password) {
    throw new CustomError("error_bad_request", "This card is not activated");
  }
};
const checkIfCardIsAlreadyBlocked = (isBlocked: boolean) => {
  if (isBlocked) {
    throw new CustomError("error_bad_request", "This card is already blocked");
  }
};
const checkIfPasswordIsWrong = (
  cardPassword: string | undefined,
  reqPassword: string
) => {
  if (
    cardPassword &&
    CryptDataUtils.decryptData(cardPassword) !== reqPassword
  ) {
    throw new CustomError("error_unauthorized", "Wrong password");
  }
};

export async function createNewCard(
  API_KEY: string,
  employeeId: number,
  cardType: TransactionTypes
) {
  const company = await CompanyRepository.findByApiKey(API_KEY);
  checkIfCompanyDoesNotExist(company);

  const employee = await EmployeeRepository.findById(employeeId);
  checkIfEmployeeDoesNotExist(employee);

  const existingCard = await CardRepository.findByTypeAndEmployeeId(
    cardType,
    employeeId
  );
  checkIfEmployeeAlreadyHasTheCard(existingCard, cardType);

  const cardholderName = CardUtils.setCardholderName(employee.fullName);
  const card = new Card(employeeId, cardType, cardholderName);
  await CardRepository.insert(card);
}

export async function activateCard(
  cardId: number,
  password: string,
  CVC: string
) {
  const card = await CardRepository.findById(cardId);
  checkIfCardDoesNotExist(card);
  checkIfCardIsAlreadyActivated(card?.password);
  checkIfCardIsExpired(card.expirationDate);
  checkIfSecurityCodeIsWrong(card.securityCode, CVC);

  const encryptedPassword = CryptDataUtils.encryptData(password);
  await CardRepository.update(cardId, { password: encryptedPassword });
}

export async function blockCard(cardId: number, password: string) {
  const card = await CardRepository.findById(cardId);
  checkIfCardDoesNotExist(card);
  checkIfCardIsNotActivated(card?.password);
  checkIfCardIsExpired(card.expirationDate);
  checkIfCardIsAlreadyBlocked(card.isBlocked);
  checkIfPasswordIsWrong(card?.password, password);

  await CardRepository.update(cardId, { isBlocked: true });
}

export async function unblockCard(cardId: number, password: string) {
  const card = await CardRepository.findById(cardId);

  if (!card) {
    throw new CustomError("error_not_found", "Card not found");
  }
  if (!card?.password) {
    throw new CustomError("error_bad_request", "This card is not activated");
  }
  if (CardUtils.setIsExpired(card.expirationDate)) {
    throw new CustomError("error_bad_request", "This card is expired");
  }
  if (!card.isBlocked) {
    throw new CustomError("error_bad_request", "This card is not blocked");
  }
  if (CryptDataUtils.decryptData(card.password) !== password) {
    throw new CustomError("error_unauthorized", "Wrong password");
  }

  await CardRepository.update(cardId, { isBlocked: false });
}

export async function rechargeCard(
  cardId: number,
  API_KEY: string,
  amount: number
) {
  const company = await CompanyRepository.findByApiKey(API_KEY);
  if (!company) {
    throw new CustomError("error_not_found", "Company not found");
  }

  const card = await CardRepository.findById(cardId);
  if (!card) {
    throw new CustomError("error_not_found", "Card not found");
  }
  if (!card?.password) {
    throw new CustomError("error_bad_request", "This card is not activated");
  }
  if (CardUtils.setIsExpired(card.expirationDate)) {
    throw new CustomError("error_bad_request", "This card is expired");
  }

  await RechargeRepository.insert({ cardId, amount });
}

export async function getCardBalance(cardId: number) {
  const card = await CardRepository.findById(cardId);
  if (!card) {
    throw new CustomError("error_not_found", "Card not found");
  }

  const recharges = await RechargeRepository.findByCardId(cardId);
  const transactions = await PaymentRepository.findByCardId(cardId);

  const balance =
    recharges.reduce((prev, curr) => prev + curr.amount, 0) -
    transactions.reduce((prev, curr) => prev + curr.amount, 0);

  return { balance, transactions, recharges };
}

export async function buyFromBusiness(
  cardId: number,
  password: string,
  businessId: number,
  amount: number
) {
  const card = await CardRepository.findById(cardId);
  if (!card) {
    throw new CustomError("error_not_found", "Card not found");
  }
  if (!card?.password) {
    throw new CustomError("error_bad_request", "This card is not activated");
  }
  if (CardUtils.setIsExpired(card.expirationDate)) {
    throw new CustomError("error_bad_request", "This card is expired");
  }
  if (card.isBlocked) {
    throw new CustomError("error_bad_request", "This card is blocked");
  }
  if (CryptDataUtils.decryptData(card.password) !== password) {
    throw new CustomError("error_unauthorized", "Wrong password");
  }
  // Check business
  const business = await BusinessRepository.findById(businessId);
  if (!business) {
    throw new CustomError("error_not_found", "Business not found");
  }
  if (business.type !== card.type) {
    throw new CustomError(
      "error_bad_request",
      "The business type does not match the card type"
    );
  }

  const recharges = await RechargeRepository.findByCardId(cardId);
  const transactions = await PaymentRepository.findByCardId(cardId);
  const balance =
    recharges.reduce((prev, curr) => prev + curr.amount, 0) -
    transactions.reduce((prev, curr) => prev + curr.amount, 0);

  if (balance < amount) {
    throw new CustomError("error_bad_request", "Insufficient card balance");
  }

  await PaymentRepository.insert({ cardId, amount, businessId });
}
