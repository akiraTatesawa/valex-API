import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { CardValidatorInterface } from "./cardsServicesValidators";
import { CryptDataUtils } from "../../utils/cryptDataUtils";
import { CardUtils } from "../../utils/cardUtils";

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

    const cardUtils = new CardUtils();
    this.cardValidator.ensureCardIsNotExpired(card.expirationDate, cardUtils);

    const cryptDataUtils = new CryptDataUtils();
    this.cardValidator.ensureSecurityCodeIsCorrect(
      card.securityCode,
      CVC,
      cryptDataUtils
    );

    const encryptedPassword = cryptDataUtils.hashDataBcrypt(password);

    await this.cardRepository.update(cardId, { password: encryptedPassword });
  }
}
