import { CardRepositoryInterface } from "../../repositories/cardRepository";
import { CryptDataUtils } from "../../utils/cryptDataUtils";
import { CardValidatorInterface } from "../cardServices/cardsServicesValidators";

export interface DeleteVirtualCard {
  delete: (virtualCardId: number, password: string) => Promise<void>;
}

export class DeleteVirtualCardService implements DeleteVirtualCard {
  constructor(
    private cardValidator: CardValidatorInterface,
    private cardRepository: CardRepositoryInterface
  ) {
    this.cardValidator = cardValidator;
    this.cardRepository = cardRepository;
  }

  async delete(virtualCardId: number, password: string): Promise<void> {
    const card = await this.cardRepository.findById(virtualCardId);
    this.cardValidator.ensureCardExists(card);
    this.cardValidator.ensureCardIsVirtual(card.isVirtual);

    const cryptDataUtils = new CryptDataUtils();
    this.cardValidator.ensurePasswordIsCorrect(
      card?.password,
      password,
      cryptDataUtils
    );

    await this.cardRepository.remove(virtualCardId);
  }
}
