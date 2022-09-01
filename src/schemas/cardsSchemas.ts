import Joi from "joi";

export const createCardSchema = Joi.object({
  cardType: Joi.string()
    .valid("groceries", "restaurant", "transport", "education", "health")
    .required(),
  employeeId: Joi.number().integer().required(),
});

export const activationCardSchema = Joi.object({
  CVC: Joi.string()
    .length(3)
    .pattern(/^\d+$/)
    .message(`"CVC" must only contain numbers`)
    .required(),
  password: Joi.string()
    .length(4)
    .pattern(/^\d+$/)
    .message(`"password" must only contain numbers`)
    .required(),
});

export const blockUnblockCardSchema = Joi.object({
  password: Joi.string()
    .length(4)
    .pattern(/^\d+$/)
    .message(`"password" must only contain numbers`)
    .required(),
});

export const rechargeCardSchema = Joi.object({
  amount: Joi.number().integer().greater(0).required(),
});

export const paymentCardSchema = Joi.object({
  password: Joi.string()
    .length(4)
    .pattern(/^\d+$/)
    .message(`"password" must only contain numbers`)
    .required(),
  businessId: Joi.number().integer().required(),
  amount: Joi.number().integer().greater(0).required(),
});
