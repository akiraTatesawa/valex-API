import { VirtualCard } from "../../classes/VirtualCard";
import { ResponseCard } from "../../interfaces/cardInterfaces";
import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { CardValidatorInterface } from "../cardServices/cardsServicesValidators";
import { CryptDataInterface } from "../../utils/cryptDataUtils";

export interface CreateVirtualCard {
  create: (originalCardId: number, password: string) => Promise<ResponseCard>;
}

export class CreateVirtualCardService implements CreateVirtualCard {
  constructor(
    private cardValidator: CardValidatorInterface,
    private cardRepository: CardRepositoryInterface,
    private cryptDataUtils: CryptDataInterface
  ) {
    this.cardValidator = cardValidator;
    this.cardRepository = cardRepository;
    this.cryptDataUtils = cryptDataUtils;
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

    this.cardValidator.ensurePasswordIsCorrect(
      card?.password,
      password,
      this.cryptDataUtils
    );

    const virtualCard = new VirtualCard(
      card.employeeId,
      card.type,
      card.cardholderName,
      this.cryptDataUtils,
      originalCardId,
      card?.password
    );

    const resultCardId = await this.cardRepository.insert(virtualCard);

    return {
      cardId: resultCardId,
      number: virtualCard.number,
      cardholderName: virtualCard.cardholderName,
      securityCode: this.cryptDataUtils.decryptData(virtualCard.securityCode),
      expirationDate: virtualCard.expirationDate,
      type: virtualCard.type,
    };
  }
}
