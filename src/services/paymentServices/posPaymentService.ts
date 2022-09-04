import { BusinessRepositoryInterface } from "../../repositories/businessRepository";
import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { PaymentRepositoryInterface } from "../../repositories/paymentRepository";
import { RechargeRepositoryInterface } from "../../repositories/rechargeRepository";
import { CardValidatorInterface } from "../cardServices/cardsServicesValidators";

import { CardUtils } from "../../utils/cardUtils";
import { CryptDataUtils } from "../../utils/cryptDataUtils";

export interface POSPaymentInterface {
  execute: (
    cardId: number,
    password: string,
    businessId: number,
    amount: number
  ) => Promise<void>;
}

export class POSPaymentService implements POSPaymentInterface {
  constructor(
    private cardValidator: CardValidatorInterface,
    private cardRepository: CardRepositoryInterface,
    private businessRepository: BusinessRepositoryInterface,
    private rechargeRepository: RechargeRepositoryInterface,
    private paymentRepository: PaymentRepositoryInterface
  ) {
    this.cardValidator = cardValidator;
    this.cardRepository = cardRepository;
    this.businessRepository = businessRepository;
    this.rechargeRepository = rechargeRepository;
    this.paymentRepository = paymentRepository;
  }

  async execute(
    cardId: number,
    password: string,
    businessId: number,
    amount: number
  ): Promise<void> {
    const card = await this.cardRepository.findById(cardId);
    this.cardValidator.ensureCardExists(card);
    this.cardValidator.ensureCardIsNotVirtual(card.isVirtual, "POS shopping");
    this.cardValidator.ensureCardIsActivated(card?.password);
    this.cardValidator.ensureCardIsNotBlocked(card.isBlocked);

    const cardUtils = new CardUtils();
    this.cardValidator.ensureCardIsNotExpired(card.expirationDate, cardUtils);

    const cryptDataUtils = new CryptDataUtils();
    this.cardValidator.ensurePasswordIsCorrect(
      card?.password,
      password,
      cryptDataUtils
    );

    const business = await this.businessRepository.findById(businessId);
    this.cardValidator.ensureBusinessExists(business);
    this.cardValidator.ensureBusinessTypeIsEqualToCardType(
      business.type,
      card.type
    );

    const recharges = await this.rechargeRepository.findByCardId(cardId);
    const transactions = await this.paymentRepository.findByCardId(cardId);
    const balance = cardUtils.calcBalance(recharges, transactions);
    this.cardValidator.ensureSufficientCardBalance(balance, amount);

    await this.paymentRepository.insert({ cardId, amount, businessId });
  }
}
