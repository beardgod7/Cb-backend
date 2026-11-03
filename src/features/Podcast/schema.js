const Joi = require("joi");

const podcastSchema = Joi.object({
  title: Joi.string().required().min(1).max(255),
  description: Joi.string().required().min(1),
  link: Joi.string().uri().optional().allow(null, ""),
  audio: Joi.string().optional().allow(null, ""),
  coverImage: Joi.string().optional().allow(null, ""),
  videoUrl: Joi.string().uri().optional().allow(null, ""),
  slug: Joi.string().optional().allow(null, ""),
  season: Joi.number().integer().min(1).optional().allow(null),
  episodeNumber: Joi.number().integer().min(1).optional().allow(null),
  durationSeconds: Joi.number().integer().min(0).optional().allow(null),
  mediaType: Joi.string().valid("audio", "video").optional(),
  guests: Joi.array().items(Joi.string()).optional(),
  publishedAt: Joi.date().optional().allow(null),
  isPublished: Joi.boolean().optional().default(false),
  isLive: Joi.boolean().optional().default(false),
});

const updatePodcastSchema = Joi.object({
  title: Joi.string().optional().min(1).max(255),
  description: Joi.string().optional().min(1),
  link: Joi.string().uri().optional().allow(null, ""),
  audio: Joi.string().optional().allow(null, ""),
  coverImage: Joi.string().optional().allow(null, ""),
  videoUrl: Joi.string().uri().optional().allow(null, ""),
  slug: Joi.string().optional().allow(null, ""),
  season: Joi.number().integer().min(1).optional().allow(null),
  episodeNumber: Joi.number().integer().min(1).optional().allow(null),
  durationSeconds: Joi.number().integer().min(0).optional().allow(null),
  mediaType: Joi.string().valid("audio", "video").optional(),
  guests: Joi.array().items(Joi.string()).optional(),
  publishedAt: Joi.date().optional().allow(null),
  isPublished: Joi.boolean().optional(),
  isLive: Joi.boolean().optional(),
});

module.exports = {
  podcastSchema,
  updatePodcastSchema,
};
