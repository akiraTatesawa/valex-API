import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { CardUtils } from "../../utils/cardUtils";
import { CryptDataUtils } from "../../utils/cryptDataUtils";
import { CardValidatorInterface } from "./cardsServicesValidators";

export interface UnblockCardServiceInterface {
  execute: (cardId: number, password: string) => Promise<void>;
}

export class UnblockCardService implements UnblockCardServiceInterface {
  constructor(
    private cardValidator: CardValidatorInterface,
    private cardRepository: CardRepositoryInterface
  ) {
    this.cardValidator = cardValidator;
    this.cardRepository = cardRepository;
  }

  async execute(cardId: number, password: string) {
    const card = await this.cardRepository.findById(cardId);
    this.cardValidator.ensureCardExists(card);
    this.cardValidator.ensureCardIsActivated(card?.password);
    this.cardValidator.ensureCardIsBlocked(card.isBlocked);

    const cardUtils = new CardUtils();
    this.cardValidator.ensureCardIsNotExpired(card.expirationDate, cardUtils);

    const cryptDataUtils = new CryptDataUtils();
    this.cardValidator.ensurePasswordIsCorrect(
      card?.password,
      password,
      cryptDataUtils
    );

    await this.cardRepository.update(cardId, { isBlocked: false });
  }
}
