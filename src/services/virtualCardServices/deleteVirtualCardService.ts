import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { CryptDataInterface } from "../../utils/cryptDataUtils";
import { CardValidatorInterface } from "../cardServices/cardsServicesValidators";

export interface DeleteVirtualCard {
  delete: (virtualCardId: number, password: string) => Promise<void>;
}

export class DeleteVirtualCardService implements DeleteVirtualCard {
  constructor(
    private cardValidator: CardValidatorInterface,
    private cardRepository: CardRepositoryInterface,
    private cryptDataUtils: CryptDataInterface
  ) {
    this.cardValidator = cardValidator;
    this.cardRepository = cardRepository;
    this.cryptDataUtils = cryptDataUtils;
  }

  async delete(virtualCardId: number, password: string): Promise<void> {
    const card = await this.cardRepository.findById(virtualCardId);
    this.cardValidator.ensureCardExists(card);
    this.cardValidator.ensureCardIsVirtual(card.isVirtual);

    this.cardValidator.ensurePasswordIsCorrect(
      card?.password,
      password,
      this.cryptDataUtils
    );

    await this.cardRepository.remove(virtualCardId);
  }
}
