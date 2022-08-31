import Joi from "joi";

export const createCardSchema = Joi.object({
  API_KEY: Joi.string().required(),
  cardType: Joi.string()
    .valid("groceries", "restaurant", "transport", "education", "health")
    .required(),
});

export const activationCardSchema = Joi.object({
  CVC: Joi.string().length(3).pattern(/^\d+$/).required(),
  password: Joi.string().length(4).pattern(/^\d+$/).required(),
});
