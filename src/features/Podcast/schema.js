const Joi = require("joi");

const podcastSchema = Joi.object({
  title: Joi.string().required().min(1).max(255),
  description: Joi.string().required().min(1),
  link: Joi.string().uri().required(),
  isPublished: Joi.boolean().optional().default(false),
  isLive: Joi.boolean().optional().default(false),
});

const updatePodcastSchema = Joi.object({
  title: Joi.string().optional().min(1).max(255),
  description: Joi.string().optional().min(1),
  link: Joi.string().uri().optional(),
  isPublished: Joi.boolean().optional(),
  isLive: Joi.boolean().optional(),
});

module.exports = {
  podcastSchema,
  updatePodcastSchema,
};