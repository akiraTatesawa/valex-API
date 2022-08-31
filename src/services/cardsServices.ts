import * as CompanyRepository from "../repositories/companyRepository";
import * as EmployeeRepository from "../repositories/employeeRepository";
import * as CardRepository from "../repositories/cardRepository";
import * as CardUtils from "../utils/cardUtils";
import { CustomError } from "../classes/CustomError";
import { Card } from "../classes/Card";
import { TransactionTypes } from "../types/cardTypes";
import { decryptData, encryptData } from "../utils/cryptDataUtils";

export async function createNewCard(
  API_KEY: string,
  employeeId: number,
  cardType: TransactionTypes
) {
  const company = await CompanyRepository.findByApiKey(API_KEY);
  if (!company) {
    throw new CustomError("error_not_found", "Company not found");
  }

  const employee = await EmployeeRepository.findById(employeeId);
  if (!employee) {
    throw new CustomError("error_not_found", "Employee not found");
  }

  const existingCard = await CardRepository.findByTypeAndEmployeeId(
    cardType,
    employeeId
  );
  if (existingCard) {
    throw new CustomError(
      "error_conflict",
      `The employee already has a ${cardType} card`
    );
  }
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
  if (!card) {
    throw new CustomError("error_not_found", "Card not found");
  }
  if (card?.password) {
    throw new CustomError(
      "error_bad_request",
      "This card is already activated"
    );
  }
  if (CardUtils.setIsExpired(card.expirationDate)) {
    throw new CustomError("error_bad_request", "This card is expired");
  }
  if (decryptData(card.securityCode) !== CVC) {
    throw new CustomError("error_unauthorized", "Wrong card security code");
  }

  const encryptedPassword = encryptData(password);
  await CardRepository.update(cardId, { password: encryptedPassword });
}

export async function blockCard(cardId: number, password: string) {
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
    throw new CustomError("error_bad_request", "This card is already blocked");
  }
  if (decryptData(card.password) !== password) {
    throw new CustomError("error_unauthorized", "Wrong password");
  }

  await CardRepository.update(cardId, { isBlocked: true });
}
