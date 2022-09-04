import { OnlinePaymentData } from "../../interfaces/paymentInterfaces";
import { BusinessRepositoryInterface } from "../../repositories/businessRepository";
import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { PaymentRepositoryInterface } from "../../repositories/paymentRepository";
import { RechargeRepositoryInterface } from "../../repositories/rechargeRepository";
import { CardValidatorInterface } from "../cardServices/cardsServicesValidators";
import { CardUtils } from "../../utils/cardUtils";
import { CryptDataUtils } from "../../utils/cryptDataUtils";

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

  async execute({
    cardInfo,
    businessId,
    amount,
  }: OnlinePaymentData): Promise<void> {
    const card = await this.cardRepository.findByCardDetails(
      cardInfo.cardNumber,
      cardInfo.cardholderName,
      cardInfo.expirationDate
    );
    this.cardValidator.ensureCardExists(card);
    this.cardValidator.ensureCardIsActivated(card?.password);
    this.cardValidator.ensureCardIsNotBlocked(card.isBlocked);

    const cardUtils = new CardUtils();
    this.cardValidator.ensureCardIsNotExpired(card.expirationDate, cardUtils);

    const cryptDataUtils = new CryptDataUtils();
    this.cardValidator.ensureSecurityCodeIsCorrect(
      card.securityCode,
      cardInfo.CVC,
      cryptDataUtils
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
    const balance = cardUtils.calcBalance(recharges, transactions);
    this.cardValidator.ensureSufficientCardBalance(balance, amount);

    await this.paymentRepository.insert({ cardId, amount, businessId });
  }
}
