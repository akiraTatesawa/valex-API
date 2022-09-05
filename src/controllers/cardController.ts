/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from "express";
import { CardRepository } from "../repositories/cardRepository";
import { CompanyRepository } from "../repositories/companyRepository";
import { EmployeeRepository } from "../repositories/employeeRepository";
import { PaymentRepository } from "../repositories/paymentRepository";
import { RechargeRepository } from "../repositories/rechargeRepository";
import { ActivateCardService } from "../services/cardServices/activateCardService";
import { BlockCardService } from "../services/cardServices/blockCardService";
import { CardValidator } from "../services/cardServices/cardsServicesValidators";
import { CreateCardService } from "../services/cardServices/createCardService";
import { GetCardBalanceService } from "../services/cardServices/getCardBalanceService";
import { UnblockCardService } from "../services/cardServices/unblockCardService";
import { TransactionTypes } from "../types/cardTypes";
import { CardUtils } from "../utils/cardUtils";
import { CryptDataUtils } from "../utils/cryptDataUtils";

export async function createCard(
  req: Request<{}, {}, { cardType: TransactionTypes; employeeId: number }>,
  res: Response
) {
  const { employeeId, cardType } = req.body;
  const { API_KEY } = res.locals;

  const cardValidator = new CardValidator();
  const cardUtils = new CardUtils();
  const cryptDataUtils = new CryptDataUtils(process.env.CRYPTR_SECRET_KEY);
  const cardRepository = new CardRepository();
  const companyRepository = new CompanyRepository();
  const employeeRepository = new EmployeeRepository();

  const createCardService = new CreateCardService(
    cardValidator,
    cryptDataUtils,
    cardUtils,
    cardRepository,
    companyRepository,
    employeeRepository
  );

  const card = await createCardService.create(API_KEY, employeeId, cardType);

  return res.status(201).send(card);
}

export async function activateCard(
  req: Request<{ cardId: string }, {}, { password: string; CVC: string }>,
  res: Response
) {
  const { cardId } = req.params;
  const { password, CVC } = req.body;

  const cardValidator = new CardValidator();
  const cardUtils = new CardUtils();
  const cryptDataUtils = new CryptDataUtils(process.env.CRYPTR_SECRET_KEY);
  const cardRepository = new CardRepository();

  const activateCardService = new ActivateCardService(
    cardValidator,
    cryptDataUtils,
    cardUtils,
    cardRepository
  );

  await activateCardService.execute(parseInt(cardId, 10), password, CVC);

  return res.sendStatus(200);
}

export async function blockCard(
  req: Request<{ cardId: string }, {}, { password: string }>,
  res: Response
) {
  const { cardId } = req.params;
  const { password } = req.body;

  const cardValidator = new CardValidator();
  const cardUtils = new CardUtils();
  const cryptDataUtils = new CryptDataUtils(process.env.CRYPTR_SECRET_KEY);
  const cardRepository = new CardRepository();

  const blockCardService = new BlockCardService(
    cardValidator,
    cardUtils,
    cryptDataUtils,
    cardRepository
  );

  await blockCardService.execute(parseInt(cardId, 10), password);

  return res.sendStatus(200);
}

export async function unblockCard(
  req: Request<{ cardId: string }, {}, { password: string }>,
  res: Response
) {
  const { cardId } = req.params;
  const { password } = req.body;

  const cardValidator = new CardValidator();
  const cardUtils = new CardUtils();
  const cryptDataUtils = new CryptDataUtils(process.env.CRYPTR_SECRET_KEY);
  const cardRepository = new CardRepository();

  const unblockCardService = new UnblockCardService(
    cardValidator,
    cardUtils,
    cryptDataUtils,
    cardRepository
  );

  await unblockCardService.execute(parseInt(cardId, 10), password);

  return res.sendStatus(200);
}
export async function getCardBalance(
  req: Request<{ cardId: string }>,
  res: Response
) {
  const { cardId } = req.params;

  const cardValidator = new CardValidator();
  const cardUtils = new CardUtils();
  const cardRepository = new CardRepository();
  const rechargeRepository = new RechargeRepository();
  const paymentRepository = new PaymentRepository();

  const getCardBalanceService = new GetCardBalanceService(
    cardValidator,
    cardUtils,
    cardRepository,
    rechargeRepository,
    paymentRepository
  );

  const cardBalance = await getCardBalanceService.execute(parseInt(cardId, 10));

  return res.send(cardBalance);
}
