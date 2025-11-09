const Joi = require("joi");

const artifactSchema = Joi.object({
  identificationNumber: Joi.string().required(),
  title: Joi.string().required(),
  country: Joi.string().required(),
  category: Joi.string().required(),
  era: Joi.string().optional(),
  yearOrPeriod: Joi.string().optional(),
  shortDescription: Joi.string().max(500).optional(),
  fullDescription: Joi.string().required(),
  images: Joi.array().items(Joi.string()).optional(),
  audioNarration: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  createdBy: Joi.string().uuid().optional(),
});

const updateArtifactSchema = Joi.object({
  identificationNumber: Joi.string().optional(),
  title: Joi.string().optional(),
  country: Joi.string().optional(),
  category: Joi.string().optional(),
  era: Joi.string().optional(),
  yearOrPeriod: Joi.string().optional(),
  shortDescription: Joi.string().max(500).optional(),
  fullDescription: Joi.string().optional(),
  images: Joi.array().items(Joi.string()).optional(),
  audioNarration: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
});

const rentalRequestSchema = Joi.object({
  artifactId: Joi.string().uuid().required(),
  fullName: Joi.string().required(),
  organization: Joi.string().optional(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  purposeOfRental: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref("startDate")).required(),
  message: Joi.string().optional(),
});

const collaborationRequestSchema = Joi.object({
  name: Joi.string().required(),
  organization: Joi.string().optional(),
  email: Joi.string().email().required(),
  message: Joi.string().required(),
});

module.exports = {
  artifactSchema,
  updateArtifactSchema,
  rentalRequestSchema,
  collaborationRequestSchema,
};
