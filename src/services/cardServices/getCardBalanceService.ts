import { Recharge } from "../../interfaces/rechargeInterfaces";
import { CardRepositoryInterface } from "../../repositories/cardRepository";
import {
  PaymentRepositoryInterface,
  PaymentWithBusinessName,
} from "../../repositories/paymentRepository";
import { RechargeRepositoryInterface } from "../../repositories/rechargeRepository";
import { CardValidatorInterface } from "./cardsServicesValidators";
import { CardUtilsInterface } from "../../utils/cardUtils";

export interface Balance {
  balance: number;
  transactions: PaymentWithBusinessName[];
  recharges: Recharge[];
}

export interface GetCardBalanceServiceInterface {
  execute: (cardId: number) => Promise<Balance>;
}

export class GetCardBalanceService implements GetCardBalanceServiceInterface {
  constructor(
    private cardValidator: CardValidatorInterface,
    private cardUtils: CardUtilsInterface,
    private cardRepository: CardRepositoryInterface,
    private rechargeRepository: RechargeRepositoryInterface,
    private paymentRepository: PaymentRepositoryInterface
  ) {
    this.cardValidator = cardValidator;
    this.cardUtils = cardUtils;
    this.cardRepository = cardRepository;
    this.rechargeRepository = rechargeRepository;
    this.paymentRepository = paymentRepository;
  }

  async execute(cardId: number): Promise<Balance> {
    const card = await this.cardRepository.findById(cardId);
    this.cardValidator.ensureCardExists(card);

    const id = card.originalCardId! ? card.originalCardId : cardId;

    const recharges = await this.rechargeRepository.findByCardId(id);
    const transactions = await this.paymentRepository.findByCardId(id);
    const balance = this.cardUtils.calcBalance(recharges, transactions);

    return { balance, transactions, recharges };
  }
}
