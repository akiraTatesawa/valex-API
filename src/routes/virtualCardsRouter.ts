import { Router } from "express";

export const virtualCardsRouter = Router();

// Create a virtual card
virtualCardsRouter.post("/cards/virtual/create");

// Delete a virtual card
virtualCardsRouter.delete("/cards/:virtualCardId/virtual/delete");
