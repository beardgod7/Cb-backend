const Joi = require("joi");

const podcastSchema = Joi.object({
  title: Joi.string().required().min(1).max(255),
  description: Joi.string().required().min(1),
  link: Joi.string().uri().optional().allow(null, ""),
  audio: Joi.string().optional().allow(null, ""), // Cloudinary URL after upload
  coverImage: Joi.string().optional().allow(null, ""), // Cloudinary URL after upload
  isPublished: Joi.boolean().optional().default(false),
  isLive: Joi.boolean().optional().default(false),
});

const updatePodcastSchema = Joi.object({
  title: Joi.string().optional().min(1).max(255),
  description: Joi.string().optional().min(1),
  link: Joi.string().uri().optional().allow(null, ""),
  audio: Joi.string().optional().allow(null, ""), // Cloudinary URL after upload
  coverImage: Joi.string().optional().allow(null, ""), // Cloudinary URL after upload
  isPublished: Joi.boolean().optional(),
  isLive: Joi.boolean().optional(),
});

module.exports = {
  podcastSchema,
  updatePodcastSchema,
};