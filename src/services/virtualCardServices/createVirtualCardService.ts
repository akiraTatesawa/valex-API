import { VirtualCard } from "../../classes/VirtualCard";
import { ResponseCard } from "../../interfaces/cardInterfaces";
import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { CardValidatorInterface } from "../cardServices/cardsServicesValidators";
import { CryptDataUtils } from "../../utils/cryptDataUtils";

export interface CreateVirtualCard {
  create: (originalCardId: number, password: string) => Promise<ResponseCard>;
}

export class CreateVirtualCardService implements CreateVirtualCard {
  constructor(
    private cardValidator: CardValidatorInterface,
    private cardRepository: CardRepositoryInterface
  ) {
    this.cardValidator = cardValidator;
    this.cardRepository = cardRepository;
  }

  async create(
    originalCardId: number,
    password: string
  ): Promise<ResponseCard> {
    const card = await this.cardRepository.findById(originalCardId);
    this.cardValidator.ensureCardExists(card);
    this.cardValidator.ensureCardIsActivated(card?.password);
    this.cardValidator.ensureCardIsNotVirtual(
      card.isVirtual,
      "virtual card creation"
    );

    const cryptDataUtils = new CryptDataUtils();
    this.cardValidator.ensurePasswordIsCorrect(
      card?.password,
      password,
      cryptDataUtils
    );

    const virtualCard = new VirtualCard(
      card.employeeId,
      card.type,
      card.cardholderName,
      cryptDataUtils,
      originalCardId,
      card?.password
    );

    const resultCardId = await this.cardRepository.insert(virtualCard);

    return {
      cardId: resultCardId,
      number: virtualCard.number,
      cardholderName: virtualCard.cardholderName,
      securityCode: cryptDataUtils.decryptData(virtualCard.securityCode),
      expirationDate: virtualCard.expirationDate,
      type: virtualCard.type,
    };
  }
}
