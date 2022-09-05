import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { CardValidatorInterface } from "./cardsServicesValidators";
import { CryptDataInterface } from "../../utils/cryptDataUtils";
import { CardUtilsInterface } from "../../utils/cardUtils";

export interface ActivateCardServiceInterface {
  execute: (cardId: number, password: string, CVC: string) => Promise<void>;
}

export class ActivateCardService implements ActivateCardServiceInterface {
  constructor(
    private cardValidator: CardValidatorInterface,
    private cryptDataUtils: CryptDataInterface,
    private cardUtils: CardUtilsInterface,
    private cardRepository: CardRepositoryInterface
  ) {
    this.cardValidator = cardValidator;
    this.cardUtils = cardUtils;
    this.cryptDataUtils = cryptDataUtils;
    this.cardRepository = cardRepository;
  }

  async execute(cardId: number, password: string, CVC: string) {
    const card = await this.cardRepository.findById(cardId);
    this.cardValidator.ensureCardExists(card);
    this.cardValidator.ensureCardIsNotActivated(card?.password);

    this.cardValidator.ensureCardIsNotExpired(
      card.expirationDate,
      this.cardUtils
    );

    this.cardValidator.ensureSecurityCodeIsCorrect(
      card.securityCode,
      CVC,
      this.cryptDataUtils
    );

    const encryptedPassword = this.cryptDataUtils.hashDataBcrypt(password);

    await this.cardRepository.update(cardId, { password: encryptedPassword });
  }
}
