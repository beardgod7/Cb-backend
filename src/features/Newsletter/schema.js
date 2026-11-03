const Joi = require("joi");

const subscribeSchema = Joi.object({
  email: Joi.string().email().required(),
  source: Joi.string().max(100).optional(),
  // Honeypot: a hidden field bots tend to fill. Must be empty.
  website: Joi.string().allow("").optional(),
});

module.exports = { subscribeSchema };
