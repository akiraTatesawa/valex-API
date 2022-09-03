import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { CardValidatorInterface } from "./cardsServicesValidators";

export interface BlockCardServiceInterface {
  execute: (cardId: number, password: string) => Promise<void>;
}

export class BlockCardService implements BlockCardServiceInterface {
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
    this.cardValidator.ensureCardIsNotExpired(card.expirationDate);
    this.cardValidator.ensureCardIsUnblocked(card.isBlocked);
    this.cardValidator.ensurePasswordIsCorrect(card?.password, password);

    await this.cardRepository.update(cardId, { isBlocked: true });
  }
}
