import { Request, Response } from "express";
import { CardRepository } from "../repositories/cardRepository";
import { CompanyRepository } from "../repositories/companyRepository";
import { RechargeRepository } from "../repositories/rechargeRepository";
import { CardValidator } from "../services/cardServices/cardsServicesValidators";
import { RechargeCardService } from "../services/cardServices/rechargeCardService";
import { CardUtils } from "../utils/cardUtils";

export async function rechargeCard(
  req: Request<{ cardId: string }, {}, { amount: number }>,
  res: Response
) {
  const { cardId } = req.params;
  const { amount } = req.body;
  const { API_KEY } = res.locals;

  const cardValidator = new CardValidator();
  const cardUtils = new CardUtils();
  const cardRepository = new CardRepository();
  const rechargeRepository = new RechargeRepository();
  const companyRepository = new CompanyRepository();

  const rechargeCardService = new RechargeCardService(
    cardValidator,
    cardUtils,
    cardRepository,
    rechargeRepository,
    companyRepository
  );

  await rechargeCardService.execute(parseInt(cardId, 10), API_KEY, amount);

  return res.sendStatus(201);
}
