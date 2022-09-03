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
import { Card as ICard, ResponseCard } from "../interfaces/cardInterfaces";
import { OnlinePaymentData } from "../interfaces/paymentInterfaces";
import { Company } from "../interfaces/companyInterfaces";
import { Employee } from "../interfaces/employeeInterfaces";
import { Business } from "../interfaces/businessInterfaces";
import { VirtualCard } from "../classes/VirtualCard";

// Validators
function ensureCompanyExists(company: Company) {
  if (!company) {
    throw new CustomError("error_not_found", "Company not found");
  }
}
function ensureBusinessExists(business: Business) {
  if (!business) {
    throw new CustomError("error_not_found", "Business not found");
  }
}
function ensureEmployeeExists(employee: Employee) {
  if (!employee) {
    throw new CustomError("error_not_found", "Employee not found");
  }
}
function ensureEmployeeDoesNotHaveThisCardType(card: ICard, cardType: string) {
  if (card) {
    throw new CustomError(
      "error_conflict",
      `The employee already has a ${cardType} card`
    );
  }
}
function ensureCardExists(card: ICard) {
  if (!card) {
    throw new CustomError("error_not_found", "Card not found");
  }
}
function ensureCardIsNotActivated(password: string | undefined) {
  if (password) {
    throw new CustomError(
      "error_bad_request",
      "This card is already activated"
    );
  }
}
function ensureCardIsNotExpired(expirationDate: string) {
  if (CardUtils.setIsExpired(expirationDate)) {
    throw new CustomError("error_bad_request", "This card is expired");
  }
}
function ensureSecurityCodeIsCorrect(cardSecurityCode: string, reqCVC: string) {
  if (CryptDataUtils.decryptData(cardSecurityCode) !== reqCVC) {
    throw new CustomError("error_unauthorized", "Incorrect card security code");
  }
}
function ensureCardIsActivated(password: string | undefined) {
  if (!password) {
    throw new CustomError("error_bad_request", "This card is not activated");
  }
}
function ensureCardIsUnblocked(isBlocked: boolean) {
  if (isBlocked) {
    throw new CustomError("error_bad_request", "This card is already blocked");
  }
}
function ensureCardIsNotBlocked(isBlocked: boolean) {
  if (isBlocked) {
    throw new CustomError("error_bad_request", "This card is blocked");
  }
}
function ensureCardIsBlocked(isBlocked: boolean) {
  if (!isBlocked) {
    throw new CustomError("error_bad_request", "This card is not blocked");
  }
}
function ensurePasswordIsCorrect(
  cardPassword: string | undefined,
  reqPassword: string
) {
  if (
    cardPassword &&
    CryptDataUtils.decryptData(cardPassword) !== reqPassword
  ) {
    throw new CustomError("error_unauthorized", "Incorrect password");
  }
}
function ensureBusinessTypeIsEqualToCardType(
  businessType: TransactionTypes,
  cardType: TransactionTypes
) {
  if (businessType !== cardType) {
    throw new CustomError(
      "error_bad_request",
      "The business type does not match the card type"
    );
  }
}
function ensureSufficientCardBalance(balance: number, amount: number) {
  if (balance < amount) {
    throw new CustomError("error_bad_request", "Insufficient card balance");
  }
}
function ensureCardIsNotVirtual(isVirtual: boolean) {
  if (isVirtual) {
    throw new CustomError(
      "error_bad_request",
      "Cannot create virtual card from another virtual card"
    );
  }
}
function ensureCardIsVirtual(isVirtual: boolean) {
  if (!isVirtual) {
    throw new CustomError("error_bad_request", "This is not a virtual card");
  }
}

// Repositories getters
async function getCompanyByAPIkey(API_KEY: string) {
  return CompanyRepository.findByApiKey(API_KEY);
}
async function getEmployeeById(employeeId: number) {
  return EmployeeRepository.findById(employeeId);
}
async function getCardByTypeAndEmployeeId(
  cardType: TransactionTypes,
  employeeId: number
) {
  return CardRepository.findByTypeAndEmployeeId(cardType, employeeId);
}
async function getCardById(cardId: number) {
  return CardRepository.findById(cardId);
}
async function getCardByDetails(
  number: string,
  name: string,
  expirationDate: string
) {
  return CardRepository.findByCardDetails(number, name, expirationDate);
}
async function getRechargesByCardId(cardId: number) {
  return RechargeRepository.findByCardId(cardId);
}
async function getPaymentsByCardId(cardId: number) {
  return PaymentRepository.findByCardId(cardId);
}
async function getBusinessById(businessId: number) {
  return BusinessRepository.findById(businessId);
}

export async function createNewCard(
  API_KEY: string,
  employeeId: number,
  cardType: TransactionTypes
): Promise<ResponseCard> {
  const company = await getCompanyByAPIkey(API_KEY);
  ensureCompanyExists(company);

  const employee = await getEmployeeById(employeeId);
  ensureEmployeeExists(employee);

  const existingCard = await getCardByTypeAndEmployeeId(cardType, employeeId);
  ensureEmployeeDoesNotHaveThisCardType(existingCard, cardType);

  const cardholderName = CardUtils.setCardholderName(employee.fullName);
  const card = new Card(employeeId, cardType, cardholderName);
  const cardId = await CardRepository.insert(card);

  return {
    cardId,
    number: card.number,
    cardholderName: card.cardholderName,
    securityCode: CryptDataUtils.decryptData(card.securityCode),
    expirationDate: card.expirationDate,
    type: card.type,
  };
}

export async function activateCard(
  cardId: number,
  password: string,
  CVC: string
) {
  const card = await getCardById(cardId);
  ensureCardExists(card);
  ensureCardIsNotActivated(card?.password);
  ensureCardIsNotExpired(card.expirationDate);
  ensureSecurityCodeIsCorrect(card.securityCode, CVC);

  const encryptedPassword = CryptDataUtils.encryptData(password);
  await CardRepository.update(cardId, { password: encryptedPassword });
}

export async function blockCard(cardId: number, password: string) {
  const card = await getCardById(cardId);
  ensureCardExists(card);
  ensureCardIsActivated(card?.password);
  ensureCardIsNotExpired(card.expirationDate);
  ensureCardIsUnblocked(card.isBlocked);
  ensurePasswordIsCorrect(card?.password, password);

  await CardRepository.update(cardId, { isBlocked: true });
}

export async function unblockCard(cardId: number, password: string) {
  const card = await getCardById(cardId);

  ensureCardExists(card);
  ensureCardIsActivated(card?.password);
  ensureCardIsNotExpired(card.expirationDate);
  ensureCardIsBlocked(card.isBlocked);
  ensurePasswordIsCorrect(card?.password, password);

  await CardRepository.update(cardId, { isBlocked: false });
}

export async function rechargeCard(
  cardId: number,
  API_KEY: string,
  amount: number
) {
  const company = await getCompanyByAPIkey(API_KEY);
  ensureCompanyExists(company);

  const card = await getCardById(cardId);
  ensureCardExists(card);
  ensureCardIsActivated(card?.password);
  ensureCardIsNotExpired(card.expirationDate);

  await RechargeRepository.insert({ cardId, amount });
}

export async function getCardBalance(cardId: number) {
  const card = await getCardById(cardId);
  ensureCardExists(card);

  const recharges = await getRechargesByCardId(cardId);
  const transactions = await getPaymentsByCardId(cardId);

  const balance = CardUtils.calcBalance(recharges, transactions);

  return { balance, transactions, recharges };
}

export async function buyFromBusiness(
  cardId: number,
  password: string,
  businessId: number,
  amount: number
) {
  const card = await getCardById(cardId);
  ensureCardExists(card);
  ensureCardIsActivated(card?.password);
  ensureCardIsNotExpired(card.expirationDate);
  ensureCardIsNotBlocked(card.isBlocked);
  ensurePasswordIsCorrect(card?.password, password);

  const business = await getBusinessById(businessId);
  ensureBusinessExists(business);
  ensureBusinessTypeIsEqualToCardType(business.type, card.type);

  const recharges = await getRechargesByCardId(cardId);
  const transactions = await getPaymentsByCardId(cardId);
  const balance = CardUtils.calcBalance(recharges, transactions);
  ensureSufficientCardBalance(balance, amount);

  await PaymentRepository.insert({ cardId, amount, businessId });
}

export async function buyFromBusinessOnline(paymentData: OnlinePaymentData) {
  const { cardInfo, businessId, amount } = paymentData;
  const card = await getCardByDetails(
    cardInfo.cardNumber,
    cardInfo.cardholderName,
    cardInfo.expirationDate
  );

  ensureCardExists(card);
  ensureCardIsActivated(card?.password);
  ensureCardIsNotExpired(card.expirationDate);
  ensureCardIsNotBlocked(card.isBlocked);
  ensureSecurityCodeIsCorrect(card.securityCode, cardInfo.CVC);

  const business = await getBusinessById(businessId);
  ensureBusinessExists(business);
  ensureBusinessTypeIsEqualToCardType(business.type, card.type);

  const recharges = await getRechargesByCardId(card.id);
  const transactions = await getPaymentsByCardId(card.id);
  const balance = CardUtils.calcBalance(recharges, transactions);
  ensureSufficientCardBalance(balance, amount);

  await PaymentRepository.insert({ cardId: card.id, amount, businessId });
}

export async function createVirtualCard(
  originalCardId: number,
  password: string
): Promise<ResponseCard> {
  const card = await getCardById(originalCardId);
  ensureCardExists(card);
  ensureCardIsActivated(card?.password);
  ensurePasswordIsCorrect(card?.password, password);
  ensureCardIsNotVirtual(card.isVirtual);

  const virtualCard = new VirtualCard(
    card.employeeId,
    card.type,
    card.cardholderName,
    originalCardId,
    card?.password
  );

  const cardId = await CardRepository.insert(virtualCard);

  return {
    cardId,
    number: virtualCard.number,
    cardholderName: virtualCard.cardholderName,
    securityCode: CryptDataUtils.decryptData(virtualCard.securityCode),
    expirationDate: virtualCard.expirationDate,
    type: virtualCard.type,
  };
}

export async function deleteVirtualCard(
  virtualCardId: number,
  password: string
) {
  const card = await getCardById(virtualCardId);
  ensureCardExists(card);
  ensureCardIsVirtual(card.isVirtual);
  ensurePasswordIsCorrect(card?.password, password);

  await CardRepository.remove(virtualCardId);
}
