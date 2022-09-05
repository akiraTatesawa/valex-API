import { Request, Response } from "express";
import {
  createVirtualCardService,
  deleteVirtualCardService,
} from "../services/virtualCardServices";

export async function createVirtualCard(
  req: Request<{}, {}, { originalCardId: number; password: string }>,
  res: Response
) {
  const { originalCardId, password } = req.body;

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

  await deleteVirtualCardService.delete(virtualCardId, password);

  return res.sendStatus(204);
}
