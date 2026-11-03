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
  audioDurationSeconds: Joi.number().integer().min(0).optional(),
  isRentable: Joi.boolean().optional(),
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
  audioDurationSeconds: Joi.number().integer().min(0).optional(),
  isRentable: Joi.boolean().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
});

// Matches the design's Rent Artefact form. Names + renterType + terms required;
// purpose and dates optional. organization required when renterType != individual
// (enforced in the controller for a clear ORGANIZATION_REQUIRED code).
const rentalRequestSchema = Joi.object({
  artifactId: Joi.string().uuid().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  fullName: Joi.string().optional(),
  renterType: Joi.string().valid("individual", "company", "organisation").required(),
  organization: Joi.string().allow("").optional(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().allow("").optional(),
  purposeOfRental: Joi.string().allow("").optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().min(Joi.ref("startDate")).optional(),
  termsAccepted: Joi.boolean().valid(true).required(),
  message: Joi.string().allow("").optional(),
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
