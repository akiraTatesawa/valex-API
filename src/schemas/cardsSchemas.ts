import Joi from "joi";

export const createCardSchema = Joi.object({
  API_KEY: Joi.string().required(),
  cardType: Joi.string()
    .valid("groceries", "restaurants", "transport", "education", "health")
    .required(),
});
