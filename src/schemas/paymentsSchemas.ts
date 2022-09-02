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

export const paymentOnlineSchema = Joi.object({
  cardInfo: Joi.object({
    cardNumber: Joi.string()
      .length(19)
      .pattern(/^[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/)
      .message(
        `"Card Number" must follow the [0-9]*4 [0-9]*4 [0-9]*4 [0-9]*4 pattern`
      )
      .required(),
    cardholderName: Joi.string().required(),
    expirationDate: Joi.string()
      .length(5)
      .pattern(/^[0-9]{2}\/[0-9]{2}$/)
      .message(`"Expiration" date must follow the MM/YY format`)
      .required(),
    CVC: Joi.string()
      .length(3)
      .pattern(/^\d+$/)
      .message(`"CVC" must only contain numbers`)
      .required(),
  }).required(),
  businessId: Joi.number().integer().required(),
  amount: Joi.number().integer().greater(0).required(),
});
