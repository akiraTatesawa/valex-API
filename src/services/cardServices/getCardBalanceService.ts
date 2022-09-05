import { FormattedRecharge } from "../../interfaces/rechargeInterfaces";
import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { PaymentRepositoryInterface } from "../../repositories/paymentRepository";
import { RechargeRepositoryInterface } from "../../repositories/rechargeRepository";
import { CardValidatorInterface } from "./cardsServicesValidators";
import { CardUtilsInterface } from "../../utils/cardUtils";
import { FormattedPayment } from "../../interfaces/paymentInterfaces";

export interface Balance {
  balance: number;
  transactions: FormattedPayment[];
  recharges: FormattedRecharge[];
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
    const payments = await this.paymentRepository.findByCardId(id);
    const formattedRecharges = this.cardUtils.formatRecharges(recharges);
    const formattedTransactions = this.cardUtils.formatPayments(payments);
    const balance = this.cardUtils.calcBalance(recharges, payments);

    return {
      balance,
      transactions: formattedTransactions,
      recharges: formattedRecharges,
    };
  }
}
