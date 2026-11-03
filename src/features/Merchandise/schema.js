const Joi = require("joi");

const cartItemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const quoteSchema = Joi.object({
  items: Joi.array().items(cartItemSchema).min(1).required(),
  country: Joi.string().optional(),
});

const deliverySchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  countryCode: Joi.string().optional(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  country: Joi.string().required(),
  state: Joi.string().required(),
  city: Joi.string().allow("").optional(),
});

const createOrderSchema = Joi.object({
  items: Joi.array().items(cartItemSchema).min(1).required(),
  delivery: deliverySchema.required(),
});

const productSchema = Joi.object({
  slug: Joi.string().optional(),
  name: Joi.string().required(),
  category: Joi.string().valid("artworks", "cultural").required(),
  price: Joi.number().integer().min(0).required(),
  stock: Joi.number().integer().min(0).default(0),
  description: Joi.string().allow("").optional(),
  images: Joi.array().optional(),
  isFeatured: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  sortOrder: Joi.number().integer().optional(),
});

const updateProductSchema = productSchema.fork(
  ["name", "category", "price"],
  (s) => s.optional()
).min(1);

const settingsSchema = Joi.object({
  salesTax: Joi.number().integer().min(0).optional(),
  deliveryFee: Joi.number().integer().min(0).optional(),
  deliveryFeeOutsideNigeria: Joi.number().integer().min(0).allow(null).optional(),
}).min(1);

module.exports = {
  quoteSchema,
  createOrderSchema,
  productSchema,
  updateProductSchema,
  settingsSchema,
};
