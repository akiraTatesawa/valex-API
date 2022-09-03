import { OnlinePaymentData } from "../../interfaces/paymentInterfaces";
import { BusinessRepositoryInterface } from "../../repositories/businessRepository";
import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { PaymentRepositoryInterface } from "../../repositories/paymentRepository";
import { RechargeRepositoryInterface } from "../../repositories/rechargeRepository";
import { CardValidatorInterface } from "../cardServices/cardsServicesValidators";
import * as CardUtils from "../../utils/cardUtils";

export interface OnlinePayment {
  execute: (paymentData: OnlinePaymentData) => Promise<void>;
}

export class OnlinePaymentService implements OnlinePayment {
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

  async execute(paymentData: OnlinePaymentData): Promise<void> {
    const { cardInfo, businessId, amount } = paymentData;
    const card = await this.cardRepository.findByCardDetails(
      cardInfo.cardNumber,
      cardInfo.cardholderName,
      cardInfo.expirationDate
    );

    this.cardValidator.ensureCardExists(card);
    this.cardValidator.ensureCardIsActivated(card?.password);
    this.cardValidator.ensureCardIsNotExpired(card.expirationDate);
    this.cardValidator.ensureCardIsNotBlocked(card.isBlocked);
    this.cardValidator.ensureSecurityCodeIsCorrect(
      card.securityCode,
      cardInfo.CVC
    );

    const business = await this.businessRepository.findById(businessId);
    this.cardValidator.ensureBusinessExists(business);
    this.cardValidator.ensureBusinessTypeIsEqualToCardType(
      business.type,
      card.type
    );

    const cardId =
      card.isVirtual && card.originalCardId ? card.originalCardId : card.id;

    const recharges = await this.rechargeRepository.findByCardId(cardId);
    const transactions = await this.paymentRepository.findByCardId(cardId);
    const balance = CardUtils.calcBalance(recharges, transactions);
    this.cardValidator.ensureSufficientCardBalance(balance, amount);

    await this.paymentRepository.insert({ cardId, amount, businessId });
  }
}
