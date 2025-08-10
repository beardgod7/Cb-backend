const Joi = require("joi");

const eventSchema = Joi.object({
  Title: Joi.string().optional(),
  Organizer: Joi.string().optional(),
  Description: Joi.string().required(),
  Location: Joi.array().items(Joi.string()).required(),
  Images: Joi.array().items(Joi.string()).optional(),
  Date: Joi.array().items(Joi.string()).optional(),
  EventHighlights: Joi.array().items(Joi.string()).optional(),
  Status: Joi.string().valid("past", "upcoming").optional(),
});

const albumSchema = Joi.object({
  Title: Joi.string().optional(),
  Images: Joi.array().items(Joi.string()).optional(),
});

const updatealbumSchema = Joi.object({
  Title: Joi.string().optional(),
  Images: Joi.array().items(Joi.string()).optional(),
});

const updateEventSchema = Joi.object({
  Title: Joi.string().optional(),
  Organizer: Joi.string().optional(),
  Description: Joi.string().optional(),
  Location: Joi.array().items(Joi.string()).optional(),
  Images: Joi.array().items(Joi.string()).optional(),
  Date: Joi.array().items(Joi.string()).optional(),
  EventHighlights: Joi.array().items(Joi.string()).optional(),
  Status: Joi.string().valid("past", "upcoming").optional(),
});

module.exports = {
  eventSchema,
  updateEventSchema,
  albumSchema,
  updatealbumSchema,
};
