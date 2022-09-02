import Joi from "joi";

export const paymentPOSSchema = Joi.object({
  cardId: Joi.number().integer().required(),
  password: Joi.string()
    .length(4)
    .pattern(/^\d+$/)
    .message(`"password" must only contain numbers`)
    .required(),
  businessId: Joi.number().integer().required(),
  amount: Joi.number().integer().greater(0).required(),
});
