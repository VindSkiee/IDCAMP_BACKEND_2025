import Joi from 'joi';

const currentYear = new Date().getFullYear();

const SongPayloadSchema = Joi.object({
  title: Joi.string().max(50).required(),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(currentYear)
    .required(),
  genre: Joi.string().max(50).required(),
  performer: Joi.string().max(50).required(),
  duration: Joi.number()
    .integer()
    .allow(null),
  albumId: Joi.string().allow(null),
});

export { SongPayloadSchema };
