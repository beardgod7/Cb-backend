const Joi = require("joi");

const collectionSchema = Joi.object({
  slug: Joi.string().optional(),
  title: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  itemKind: Joi.string().valid("document", "photoSet", "idCard").required(),
  coverImage: Joi.string().allow("").optional(),
  order: Joi.number().integer().optional(),
  isPublished: Joi.boolean().optional(),
});

const subcategorySchema = Joi.object({
  collectionId: Joi.string().required(),
  slug: Joi.string().optional(),
  title: Joi.string().required(),
  order: Joi.number().integer().optional(),
});

const itemSchema = Joi.object({
  slug: Joi.string().optional(),
  collectionId: Joi.string().required(),
  subcategoryId: Joi.string().allow(null, "").optional(),
  title: Joi.string().required(),
  year: Joi.number().integer().optional(),
  typeLabel: Joi.string().allow("").optional(),
  place: Joi.string().allow("").optional(),
  summary: Joi.string().allow("").optional(),
  thumbnail: Joi.string().allow("").optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  authors: Joi.array().items(Joi.string()).optional(),
  abstract: Joi.string().allow("").optional(),
  tableOfContents: Joi.array().optional(),
  previewPageLimit: Joi.number().integer().min(0).optional(),
  sourceFileUrl: Joi.string().allow("").optional(),
  photos: Joi.array().optional(),
  location: Joi.string().allow("").optional(),
  eventDate: Joi.string().allow("").optional(),
  participantName: Joi.string().allow("").optional(),
  country: Joi.string().allow("").optional(),
  role: Joi.string().allow("").optional(),
  cardNumber: Joi.string().allow("").optional(),
  photoUrl: Joi.string().allow("").optional(),
  cardScanUrl: Joi.string().allow("").optional(),
  isPublished: Joi.boolean().optional(),
});

const updateItemSchema = itemSchema.fork(["collectionId", "title"], (s) => s.optional()).min(1);

const pagesSchema = Joi.object({
  pages: Joi.array()
    .items(
      Joi.object({
        pageNumber: Joi.number().integer().min(1).required(),
        heading: Joi.string().allow("").optional(),
        body: Joi.string().allow("").optional(),
        imageUrl: Joi.string().allow("").optional(),
      })
    )
    .min(1)
    .required(),
});

module.exports = {
  collectionSchema,
  subcategorySchema,
  itemSchema,
  updateItemSchema,
  pagesSchema,
};
