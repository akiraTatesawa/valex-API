/* eslint-disable @typescript-eslint/indent */
import { Request, Response } from "express";
import { OnlinePaymentData } from "../interfaces/paymentInterfaces";
import { BusinessRepository } from "../repositories/businessRepository";
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
import { RechargeCardService } from "../services/cardServices/rechargeCardService";
import { UnblockCardService } from "../services/cardServices/unblockCardService";
import { OnlinePaymentService } from "../services/paymentServices/onlinePaymentService";
import { POSPaymentService } from "../services/paymentServices/posPaymentService";
import { CreateVirtualCardService } from "../services/virtualCardServices/createVirtualCardService";
import { DeleteVirtualCardService } from "../services/virtualCardServices/deleteVirtualCardService";
import { TransactionTypes } from "../types/cardTypes";

export async function createCard(
  req: Request<{}, {}, { cardType: TransactionTypes; employeeId: number }>,
  res: Response
) {
  const { employeeId, cardType } = req.body;
  const { API_KEY } = res.locals;

  const cardValidator = new CardValidator();
  const cardRepository = new CardRepository();
  const companyRepository = new CompanyRepository();
  const employeeRepository = new EmployeeRepository();

  const createCardService = new CreateCardService(
    cardValidator,
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
  const cardRepository = new CardRepository();

  const activateCardService = new ActivateCardService(
    cardValidator,
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
  const cardRepository = new CardRepository();

  const blockCardService = new BlockCardService(cardValidator, cardRepository);

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
  const cardRepository = new CardRepository();

  const unblockCardService = new UnblockCardService(
    cardValidator,
    cardRepository
  );

  await unblockCardService.execute(parseInt(cardId, 10), password);

  return res.sendStatus(200);
}

export async function rechargeCard(
  req: Request<{ cardId: string }, {}, { amount: number }>,
  res: Response
) {
  const { cardId } = req.params;
  const { amount } = req.body;
  const { API_KEY } = res.locals;

  const cardValidator = new CardValidator();
  const cardRepository = new CardRepository();
  const rechargeRepository = new RechargeRepository();
  const companyRepository = new CompanyRepository();

  const rechargeCardService = new RechargeCardService(
    cardValidator,
    cardRepository,
    rechargeRepository,
    companyRepository
  );

  await rechargeCardService.execute(parseInt(cardId, 10), API_KEY, amount);

  return res.sendStatus(201);
}

export async function getCardBalance(
  req: Request<{ cardId: string }>,
  res: Response
) {
  const { cardId } = req.params;

  const cardValidator = new CardValidator();
  const cardRepository = new CardRepository();
  const rechargeRepository = new RechargeRepository();
  const paymentRepository = new PaymentRepository();

  const getCardBalanceService = new GetCardBalanceService(
    cardValidator,
    cardRepository,
    rechargeRepository,
    paymentRepository
  );

  const cardBalance = await getCardBalanceService.execute(parseInt(cardId, 10));

  return res.send(cardBalance);
}

export async function buyFromBusinessPOS(
  req: Request<
    {},
    {},
    { cardId: number; password: string; businessId: number; amount: number }
  >,
  res: Response
) {
  const { cardId, password, businessId, amount } = req.body;

  const cardValidator = new CardValidator();
  const cardRepository = new CardRepository();
  const businessRepository = new BusinessRepository();
  const rechargeRepository = new RechargeRepository();
  const paymentRepository = new PaymentRepository();

  const posPaymentService = new POSPaymentService(
    cardValidator,
    cardRepository,
    businessRepository,
    rechargeRepository,
    paymentRepository
  );

  await posPaymentService.execute(cardId, password, businessId, amount);

  return res.sendStatus(200);
}

export async function buyFromBusinessOnline(
  req: Request<{}, {}, OnlinePaymentData>,
  res: Response
) {
  const cardValidator = new CardValidator();
  const cardRepository = new CardRepository();
  const businessRepository = new BusinessRepository();
  const rechargeRepository = new RechargeRepository();
  const paymentRepository = new PaymentRepository();

  const onlinePaymentService = new OnlinePaymentService(
    cardValidator,
    cardRepository,
    businessRepository,
    rechargeRepository,
    paymentRepository
  );

  await onlinePaymentService.execute(req.body);

  return res.sendStatus(200);
}

export async function createVirtualCard(
  req: Request<{}, {}, { originalCardId: number; password: string }>,
  res: Response
) {
  const { originalCardId, password } = req.body;

  const cardValidator = new CardValidator();
  const cardRepository = new CardRepository();

  const createVirtualCardService = new CreateVirtualCardService(
    cardValidator,
    cardRepository
  );

  const virtualCard = await createVirtualCardService.create(
    originalCardId,
    password
  );

  return res.status(201).send(virtualCard);
}

export async function deleteVirtualCard(
  req: Request<{}, {}, { virtualCardId: number; password: string }>,
  res: Response
) {
  const { virtualCardId, password } = req.body;

  const cardValidator = new CardValidator();
  const cardRepository = new CardRepository();

  const deleteVirtualCardService = new DeleteVirtualCardService(
    cardValidator,
    cardRepository
  );

  await deleteVirtualCardService.delete(virtualCardId, password);

  res.sendStatus(204);
}
