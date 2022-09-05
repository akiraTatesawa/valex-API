import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { CardUtilsInterface } from "../../utils/cardUtils";
import { CryptDataInterface } from "../../utils/cryptDataUtils";
import { CardValidatorInterface } from "./cardsServicesValidators";

export interface UnblockCardServiceInterface {
  execute: (cardId: number, password: string) => Promise<void>;
}

export class UnblockCardService implements UnblockCardServiceInterface {
  constructor(
    private cardValidator: CardValidatorInterface,
    private cardUtils: CardUtilsInterface,
    private cryptDataUtils: CryptDataInterface,
    private cardRepository: CardRepositoryInterface
  ) {
    this.cardValidator = cardValidator;
    this.cardUtils = cardUtils;
    this.cryptDataUtils = cryptDataUtils;
    this.cardRepository = cardRepository;
  }

  async execute(cardId: number, password: string) {
    const card = await this.cardRepository.findById(cardId);
    this.cardValidator.ensureCardExists(card);
    this.cardValidator.ensureCardIsActivated(card?.password);
    this.cardValidator.ensureCardIsBlocked(card.isBlocked);

    this.cardValidator.ensureCardIsNotExpired(
      card.expirationDate,
      this.cardUtils
    );

    this.cardValidator.ensurePasswordIsCorrect(
      card?.password,
      password,
      this.cryptDataUtils
    );

    await this.cardRepository.update(cardId, { isBlocked: false });
  }
}
