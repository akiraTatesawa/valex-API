import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { CompanyRepositoryInterface } from "../../repositories/companyRepository";
import { RechargeRepositoryInterface } from "../../repositories/rechargeRepository";
import { CardValidatorInterface } from "./cardsServicesValidators";

export interface RechargeCardServiceInterface {
  execute: (cardId: number, API_KEY: string, amount: number) => Promise<void>;
}

export class RechargeCardService implements RechargeCardServiceInterface {
  constructor(
    private cardValidator: CardValidatorInterface,
    private cardRepository: CardRepositoryInterface,
    private rechargeRepository: RechargeRepositoryInterface,
    private companyRepository: CompanyRepositoryInterface
  ) {
    this.cardRepository = cardRepository;
    this.cardValidator = cardValidator;
    this.rechargeRepository = rechargeRepository;
    this.companyRepository = companyRepository;
  }

  async execute(cardId: number, API_KEY: string, amount: number) {
    const company = await this.companyRepository.findByApiKey(API_KEY);
    this.cardValidator.ensureCompanyExists(company);

    const card = await this.cardRepository.findById(cardId);
    this.cardValidator.ensureCardExists(card);
    this.cardValidator.ensureCardIsNotVirtual(card.isVirtual, "recharge");
    this.cardValidator.ensureCardIsActivated(card?.password);
    this.cardValidator.ensureCardIsNotExpired(card.expirationDate);

    await this.rechargeRepository.insert({ cardId, amount });
  }
}
