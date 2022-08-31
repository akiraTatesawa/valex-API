import Joi from "joi";

export const API_KEYSchema = Joi.object({
  API_KEY: Joi.string().required(),
});
