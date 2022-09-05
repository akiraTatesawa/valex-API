import { Request, Response } from "express";
import { CardRepository } from "../repositories/cardRepository";
import { CardValidator } from "../services/cardServices/cardsServicesValidators";
import { CreateVirtualCardService } from "../services/virtualCardServices/createVirtualCardService";
import { DeleteVirtualCardService } from "../services/virtualCardServices/deleteVirtualCardService";
import { CryptDataUtils } from "../utils/cryptDataUtils";

export async function createVirtualCard(
  req: Request<{}, {}, { originalCardId: number; password: string }>,
  res: Response
) {
  const { originalCardId, password } = req.body;

  const cardValidator = new CardValidator();
  const cardRepository = new CardRepository();
  const cryptDataUtils = new CryptDataUtils(process.env.CRYPTR_SECRET_KEY);

  const createVirtualCardService = new CreateVirtualCardService(
    cardValidator,
    cardRepository,
    cryptDataUtils
  );

  const virtualCard = await createVirtualCardService.create(
    originalCardId,
    password
  );

  return res.status(201).send(virtualCard);
}

export async function deleteVirtualCard(
  req: Request<{}, {}, { virtualCardId: number; password: string }>,
  res: Response
) {
  const { virtualCardId, password } = req.body;

  const cardValidator = new CardValidator();
  const cardRepository = new CardRepository();
  const cryptDataUtils = new CryptDataUtils(process.env.CRYPTR_SECRET_KEY);

  const deleteVirtualCardService = new DeleteVirtualCardService(
    cardValidator,
    cardRepository,
    cryptDataUtils
  );

  await deleteVirtualCardService.delete(virtualCardId, password);

  return res.sendStatus(204);
}
