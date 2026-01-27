import Joi from 'joi';

const UserPayloadSchema = Joi.object({
  username: Joi.string().min(3).max(12).required(),
  password: Joi.string().min(6).max(12).required(),
  fullname: Joi.string().min(3).max(20).required(),
});

export { UserPayloadSchema };
