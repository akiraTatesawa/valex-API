import * as CompanyRepository from "../../repositories/companyRepository";
import * as EmployeeRepository from "../../repositories/employeeRepository";
import * as CardRepository from "../../repositories/cardRepository";
import * as RechargeRepository from "../../repositories/rechargeRepository";
import * as PaymentRepository from "../../repositories/paymentRepository";
import * as BusinessRepository from "../../repositories/businessRepository";
import * as CardUtils from "../../utils/cardUtils";
import * as CryptDataUtils from "../../utils/cryptDataUtils";
import { Card } from "../../classes/Card";
import { TransactionTypes } from "../../types/cardTypes";
import { ResponseCard } from "../../interfaces/cardInterfaces";
import { OnlinePaymentData } from "../../interfaces/paymentInterfaces";
import { VirtualCard } from "../../classes/VirtualCard";
import { CardValidator } from "./cardsServicesValidators";

// Repositories getters
export async function getCompanyByAPIkey(API_KEY: string) {
  return CompanyRepository.findByApiKey(API_KEY);
}
export async function getEmployeeById(employeeId: number) {
  return EmployeeRepository.findById(employeeId);
}
export async function getCardByTypeAndEmployeeId(
  cardType: TransactionTypes,
  employeeId: number
) {
  return CardRepository.findByTypeAndEmployeeId(cardType, employeeId);
}
export async function getCardById(cardId: number) {
  return CardRepository.findById(cardId);
}
export async function getCardByDetails(
  number: string,
  name: string,
  expirationDate: string
) {
  return CardRepository.findByCardDetails(number, name, expirationDate);
}
export async function getRechargesByCardId(cardId: number) {
  return RechargeRepository.findByCardId(cardId);
}
export async function getPaymentsByCardId(cardId: number) {
  return PaymentRepository.findByCardId(cardId);
}
export async function getBusinessById(businessId: number) {
  return BusinessRepository.findById(businessId);
}

export async function createNewCard(
  API_KEY: string,
  employeeId: number,
  cardType: TransactionTypes
): Promise<ResponseCard> {
  const cardValidator = new CardValidator();

  const company = await getCompanyByAPIkey(API_KEY);
  cardValidator.ensureCompanyExists(company);

  const employee = await getEmployeeById(employeeId);
  cardValidator.ensureEmployeeExists(employee);

  const existingCard = await getCardByTypeAndEmployeeId(cardType, employeeId);
  cardValidator.ensureEmployeeDoesNotHaveThisCardType(existingCard, cardType);

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
  const cardValidator = new CardValidator();
  const card = await getCardById(cardId);
  cardValidator.ensureCardExists(card);
  cardValidator.ensureCardIsNotActivated(card?.password);
  cardValidator.ensureCardIsNotExpired(card.expirationDate);
  cardValidator.ensureSecurityCodeIsCorrect(card.securityCode, CVC);

  const encryptedPassword = CryptDataUtils.encryptData(password);
  await CardRepository.update(cardId, { password: encryptedPassword });
}

export async function blockCard(cardId: number, password: string) {
  const cardValidator = new CardValidator();
  const card = await getCardById(cardId);
  cardValidator.ensureCardExists(card);
  cardValidator.ensureCardIsActivated(card?.password);
  cardValidator.ensureCardIsNotExpired(card.expirationDate);
  cardValidator.ensureCardIsUnblocked(card.isBlocked);
  cardValidator.ensurePasswordIsCorrect(card?.password, password);

  await CardRepository.update(cardId, { isBlocked: true });
}

export async function unblockCard(cardId: number, password: string) {
  const cardValidator = new CardValidator();
  const card = await getCardById(cardId);

  cardValidator.ensureCardExists(card);
  cardValidator.ensureCardIsActivated(card?.password);
  cardValidator.ensureCardIsNotExpired(card.expirationDate);
  cardValidator.ensureCardIsBlocked(card.isBlocked);
  cardValidator.ensurePasswordIsCorrect(card?.password, password);

  await CardRepository.update(cardId, { isBlocked: false });
}

export async function rechargeCard(
  cardId: number,
  API_KEY: string,
  amount: number
) {
  const cardValidator = new CardValidator();

  const company = await getCompanyByAPIkey(API_KEY);
  cardValidator.ensureCompanyExists(company);

  const card = await getCardById(cardId);
  cardValidator.ensureCardExists(card);
  cardValidator.ensureCardIsNotVirtual(card.isVirtual, "recharge");
  cardValidator.ensureCardIsActivated(card?.password);
  cardValidator.ensureCardIsNotExpired(card.expirationDate);

  await RechargeRepository.insert({ cardId, amount });
}

export async function getCardBalance(cardId: number) {
  const cardValidator = new CardValidator();

  const card = await getCardById(cardId);
  cardValidator.ensureCardExists(card);

  const id =
    card.isVirtual && card.originalCardId ? card.originalCardId : cardId;

  const recharges = await getRechargesByCardId(id);
  const transactions = await getPaymentsByCardId(id);

  const balance = CardUtils.calcBalance(recharges, transactions);

  return { balance, transactions, recharges };
}

export async function buyFromBusiness(
  cardId: number,
  password: string,
  businessId: number,
  amount: number
) {
  const cardValidator = new CardValidator();

  const card = await getCardById(cardId);
  cardValidator.ensureCardExists(card);
  cardValidator.ensureCardIsNotVirtual(card.isVirtual, "POS shopping");
  cardValidator.ensureCardIsActivated(card?.password);
  cardValidator.ensureCardIsNotExpired(card.expirationDate);
  cardValidator.ensureCardIsNotBlocked(card.isBlocked);
  cardValidator.ensurePasswordIsCorrect(card?.password, password);

  const business = await getBusinessById(businessId);
  cardValidator.ensureBusinessExists(business);
  cardValidator.ensureBusinessTypeIsEqualToCardType(business.type, card.type);

  const recharges = await getRechargesByCardId(cardId);
  const transactions = await getPaymentsByCardId(cardId);
  const balance = CardUtils.calcBalance(recharges, transactions);
  cardValidator.ensureSufficientCardBalance(balance, amount);

  await PaymentRepository.insert({ cardId, amount, businessId });
}

export async function buyFromBusinessOnline(paymentData: OnlinePaymentData) {
  const { cardInfo, businessId, amount } = paymentData;

  const cardValidator = new CardValidator();

  const card = await getCardByDetails(
    cardInfo.cardNumber,
    cardInfo.cardholderName,
    cardInfo.expirationDate
  );

  cardValidator.ensureCardExists(card);
  cardValidator.ensureCardIsActivated(card?.password);
  cardValidator.ensureCardIsNotExpired(card.expirationDate);
  cardValidator.ensureCardIsNotBlocked(card.isBlocked);
  cardValidator.ensureSecurityCodeIsCorrect(card.securityCode, cardInfo.CVC);

  const business = await getBusinessById(businessId);
  cardValidator.ensureBusinessExists(business);
  cardValidator.ensureBusinessTypeIsEqualToCardType(business.type, card.type);

  const cardId =
    card.isVirtual && card.originalCardId ? card.originalCardId : card.id;

  const recharges = await getRechargesByCardId(cardId);
  const transactions = await getPaymentsByCardId(cardId);
  const balance = CardUtils.calcBalance(recharges, transactions);
  cardValidator.ensureSufficientCardBalance(balance, amount);

  await PaymentRepository.insert({ cardId, amount, businessId });
}

export async function createVirtualCard(
  originalCardId: number,
  password: string
): Promise<ResponseCard> {
  const cardValidator = new CardValidator();

  const card = await getCardById(originalCardId);
  cardValidator.ensureCardExists(card);
  cardValidator.ensureCardIsActivated(card?.password);
  cardValidator.ensurePasswordIsCorrect(card?.password, password);
  cardValidator.ensureCardIsNotVirtual(card.isVirtual, "virtual card creation");

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
  const cardValidator = new CardValidator();

  const card = await getCardById(virtualCardId);
  cardValidator.ensureCardExists(card);
  cardValidator.ensureCardIsVirtual(card.isVirtual);
  cardValidator.ensurePasswordIsCorrect(card?.password, password);

  await CardRepository.remove(virtualCardId);
}
