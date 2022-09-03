import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { CardValidatorInterface } from "./cardsServicesValidators";
import * as CryptDataUtils from "../../utils/cryptDataUtils";

export interface ActivateCardServiceInterface {
  execute: (cardId: number, password: string, CVC: string) => Promise<void>;
}

export class ActivateCardService implements ActivateCardServiceInterface {
  constructor(
    private cardValidator: CardValidatorInterface,
    private cardRepository: CardRepositoryInterface
  ) {
    this.cardValidator = cardValidator;
    this.cardRepository = cardRepository;
  }

  async execute(cardId: number, password: string, CVC: string) {
    const card = await this.cardRepository.findById(cardId);

    this.cardValidator.ensureCardExists(card);
    this.cardValidator.ensureCardIsNotActivated(card?.password);
    this.cardValidator.ensureCardIsNotExpired(card.expirationDate);
    this.cardValidator.ensureSecurityCodeIsCorrect(card.securityCode, CVC);

    const encryptedPassword = CryptDataUtils.encryptData(password);
    await this.cardRepository.update(cardId, { password: encryptedPassword });
  }
}
