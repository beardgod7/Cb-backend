const Joi = require("joi");

const bookstoreCategorySchema = Joi.object({
  name: Joi.string().required().trim().max(255),
  description: Joi.string().optional().allow("").max(1000),
  isActive: Joi.boolean().optional(),
});

const updateBookstoreCategorySchema = Joi.object({
  name: Joi.string().optional().trim().max(255),
  description: Joi.string().optional().allow("").max(1000),
  isActive: Joi.boolean().optional(),
});

const previewPagesSchema = Joi.alternatives().try(
  // Array of text objects
  Joi.array().items(
    Joi.object({
      page_title: Joi.string().required(),
      text: Joi.string().required(),
    })
  ),
  // Array of image URLs
  Joi.array().items(Joi.string().uri()),
  // Single PDF URL
  Joi.string().uri()
);

const bookstoreBookSchema = Joi.object({
  author: Joi.string().required().trim().max(255),
  title: Joi.string().required().trim().max(255),
  price: Joi.number().positive().precision(2).required(),
  shortDescription: Joi.string().optional().allow("").max(500),
  longDescription: Joi.string().optional().allow(""),
  numberOfChapters: Joi.number().integer().min(0).optional(),
  numberOfPages: Joi.number().integer().min(0).optional(),
  numberOfParts: Joi.number().integer().min(0).optional(),
  editors: Joi.array().items(Joi.string().trim()).optional(),
  previewPages: previewPagesSchema.optional(),
  previewType: Joi.string().valid("text", "images", "pdf").optional(),
  coverPage: Joi.string().uri().optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  createdBy: Joi.string().uuid().optional(),
});

const updateBookstoreBookSchema = Joi.object({
  author: Joi.string().optional().trim().max(255),
  title: Joi.string().optional().trim().max(255),
  price: Joi.number().positive().precision(2).optional(),
  shortDescription: Joi.string().optional().allow("").max(500),
  longDescription: Joi.string().optional().allow(""),
  numberOfChapters: Joi.number().integer().min(0).optional(),
  numberOfPages: Joi.number().integer().min(0).optional(),
  numberOfParts: Joi.number().integer().min(0).optional(),
  editors: Joi.array().items(Joi.string().trim()).optional(),
  previewPages: previewPagesSchema.optional(),
  previewType: Joi.string().valid("text", "images", "pdf").optional(),
  coverPage: Joi.string().uri().optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
});

module.exports = {
  bookstoreCategorySchema,
  updateBookstoreCategorySchema,
  bookstoreBookSchema,
  updateBookstoreBookSchema,
};