import { BusinessRepositoryInterface } from "../../repositories/businessRepository";
import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { PaymentRepositoryInterface } from "../../repositories/paymentRepository";
import { RechargeRepositoryInterface } from "../../repositories/rechargeRepository";
import { CardValidatorInterface } from "../cardServices/cardsServicesValidators";
import { CardUtilsInterface } from "../../utils/cardUtils";
import { CryptDataInterface } from "../../utils/cryptDataUtils";

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
    private cryptDataUtils: CryptDataInterface,
    private cardUtils: CardUtilsInterface,
    private cardRepository: CardRepositoryInterface,
    private businessRepository: BusinessRepositoryInterface,
    private rechargeRepository: RechargeRepositoryInterface,
    private paymentRepository: PaymentRepositoryInterface
  ) {
    this.cardValidator = cardValidator;
    this.cardUtils = cardUtils;
    this.cryptDataUtils = cryptDataUtils;
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

    this.cardValidator.ensureCardIsNotExpired(
      card.expirationDate,
      this.cardUtils
    );

    this.cardValidator.ensurePasswordIsCorrect(
      card?.password,
      password,
      this.cryptDataUtils
    );

    const business = await this.businessRepository.findById(businessId);
    this.cardValidator.ensureBusinessExists(business);
    this.cardValidator.ensureBusinessTypeIsEqualToCardType(
      business.type,
      card.type
    );

    const recharges = await this.rechargeRepository.findByCardId(cardId);
    const transactions = await this.paymentRepository.findByCardId(cardId);
    const balance = this.cardUtils.calcBalance(recharges, transactions);
    this.cardValidator.ensureSufficientCardBalance(balance, amount);

    await this.paymentRepository.insert({ cardId, amount, businessId });
  }
}
