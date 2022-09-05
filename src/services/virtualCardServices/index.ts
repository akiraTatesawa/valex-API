import { CardRepository } from "../../repositories/cardRepository";
import { CryptDataUtils } from "../../utils/cryptDataUtils";
import { CardValidator } from "../cardServices/cardsServicesValidators";
import { CreateVirtualCardService } from "./createVirtualCardService";
import { DeleteVirtualCardService } from "./deleteVirtualCardService";

const cardValidator = new CardValidator();
const cardRepository = new CardRepository();
const cryptDataUtils = new CryptDataUtils(process.env.CRYPTR_SECRET_KEY);

export const createVirtualCardService = new CreateVirtualCardService(
  cardValidator,
  cardRepository,
  cryptDataUtils
);

export const deleteVirtualCardService = new DeleteVirtualCardService(
  cardValidator,
  cardRepository,
  cryptDataUtils
);
