const Joi = require("joi");

const programmeSchema = Joi.object({
  slug: Joi.string().optional(),
  title: Joi.string().required(),
  type: Joi.string().valid("special", "annual").required(),
  summary: Joi.string().allow("").optional(),
  coverImage: Joi.string().allow("").optional(),
  order: Joi.number().integer().optional(),
  isActive: Joi.boolean().optional(),
});

const updateProgrammeSchema = programmeSchema.fork(["title", "type"], (s) => s.optional()).min(1);

const editionSchema = Joi.object({
  year: Joi.number().integer().min(1900).max(2200).required(),
  theme: Joi.string().allow("").optional(),
  summary: Joi.string().allow("").optional(),
  dates: Joi.object({
    start: Joi.string().allow("").optional(),
    end: Joi.string().allow("").optional(),
  }).optional(),
  heroImage: Joi.string().allow("").optional(),
  gallery: Joi.array().optional(),
  isPublished: Joi.boolean().optional(),
});

const updateEditionSchema = editionSchema.fork(["year"], (s) => s.optional()).min(1);

module.exports = { programmeSchema, updateProgrammeSchema, editionSchema, updateEditionSchema };
