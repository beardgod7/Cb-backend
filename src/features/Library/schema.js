const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});

const updateCategorySchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
});

const previewContentSchema = Joi.alternatives().try(
  // Array of text objects
  Joi.array().items(
    Joi.object({
      page_title: Joi.string().required(),
      text: Joi.string().required(),
    })
  ),
  // Array of image/video/audio URLs
  Joi.array().items(Joi.string().uri()),
  // Single PDF/video/audio URL or text content
  Joi.string(),
  // Allow null for placeholder handling
  Joi.allow(null)
);

const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  yearOfPublication: Joi.number().integer().min(1000).max(9999).optional(),
  description: Joi.string().optional(),
  coverImage: Joi.string().optional(),
  previewPages: previewContentSchema.optional(),
  previewPagesType: Joi.string().valid("text", "images", "pdf").optional(),
  tableOfContents: previewContentSchema.optional(),
  tableOfContentsType: Joi.string().valid("text", "images", "pdf").optional(),
  abstractPreview: previewContentSchema.optional(),
  abstractPreviewType: Joi.string().valid("text", "images", "pdf").optional(),
  otherPreviewPages: previewContentSchema.optional(),
  otherPreviewPagesType: Joi.string().valid("text", "images", "pdf").optional(),
  scheduledVisitDate: Joi.date().optional(),
  isPreviewVisible: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  isMostPopular: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  createdBy: Joi.string().uuid().optional(),
  categoryIds: Joi.array().items(Joi.string().uuid()).optional(),
});

const updateBookSchema = Joi.object({
  title: Joi.string().optional(),
  author: Joi.string().optional(),
  yearOfPublication: Joi.number().integer().min(1000).max(9999).optional(),
  description: Joi.string().optional(),
  coverImage: Joi.string().optional(),
  previewPages: previewContentSchema.optional(),
  previewPagesType: Joi.string().valid("text", "images", "pdf").optional(),
  tableOfContents: previewContentSchema.optional(),
  tableOfContentsType: Joi.string().valid("text", "images", "pdf").optional(),
  abstractPreview: previewContentSchema.optional(),
  abstractPreviewType: Joi.string().valid("text", "images", "pdf").optional(),
  otherPreviewPages: previewContentSchema.optional(),
  otherPreviewPagesType: Joi.string().valid("text", "images", "pdf").optional(),
  scheduledVisitDate: Joi.date().optional(),
  isPreviewVisible: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  isMostPopular: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  categoryIds: Joi.array().items(Joi.string().uuid()).optional(),
});

const readingVisitSchema = Joi.object({
  bookId: Joi.string().uuid().optional(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  preferredDate: Joi.date().required(),
  message: Joi.string().optional(),
});

const librarianContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  subject: Joi.string().optional(),
  message: Joi.string().required(),
});

module.exports = {
  categorySchema,
  updateCategorySchema,
  bookSchema,
  updateBookSchema,
  readingVisitSchema,
  librarianContactSchema,
};
