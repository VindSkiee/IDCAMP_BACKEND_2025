import Joi from 'joi';

const UserPayloadSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).max(30).required(),
  fullname: Joi.string().min(3).max(50).required(),
});

export { UserPayloadSchema };
