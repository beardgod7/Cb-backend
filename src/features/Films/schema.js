const Joi = require("joi");

const filmSchema = Joi.object({
  title: Joi.string().required(),
  shortDescription: Joi.string().max(500).optional(),
  fullDescription: Joi.string().required(),
  yearOfRecording: Joi.number().integer().min(1900).max(2100).optional(),
  duration: Joi.string().optional(),
  category: Joi.string().required(),
  country: Joi.string().optional(),
  festivalYear: Joi.string().optional(),
  coverImage: Joi.string().optional(),
  thumbnailGallery: Joi.array().items(Joi.string()).optional(),
  previewVideo: Joi.string().optional(),
  fullVideo: Joi.string().optional(),
  ticketPrice: Joi.number().min(0).required(),
  tags: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
  createdBy: Joi.string().uuid().optional(),
});

const updateFilmSchema = Joi.object({
  title: Joi.string().optional(),
  shortDescription: Joi.string().max(500).optional(),
  fullDescription: Joi.string().optional(),
  yearOfRecording: Joi.number().integer().min(1900).max(2100).optional(),
  duration: Joi.string().optional(),
  category: Joi.string().optional(),
  country: Joi.string().optional(),
  festivalYear: Joi.string().optional(),
  coverImage: Joi.string().optional(),
  thumbnailGallery: Joi.array().items(Joi.string()).optional(),
  previewVideo: Joi.string().optional(),
  fullVideo: Joi.string().optional(),
  ticketPrice: Joi.number().min(0).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
  isFeatured: Joi.boolean().optional(),
});

const screeningSlotSchema = Joi.object({
  filmId: Joi.string().uuid().required(),
  screeningDate: Joi.date().required(),
  startTime: Joi.string().required(),
  endTime: Joi.string().optional(),
  maxSeats: Joi.number().integer().min(1).optional(),
  isAvailable: Joi.boolean().optional(),
});

const filmBookingSchema = Joi.object({
  filmId: Joi.string().uuid().required(),
  screeningSlotId: Joi.string().uuid().required(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  numberOfSeats: Joi.number().integer().min(1).max(10).required(),
});

const filmInquirySchema = Joi.object({
  filmId: Joi.string().uuid().optional(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  message: Joi.string().required(),
});

module.exports = {
  filmSchema,
  updateFilmSchema,
  screeningSlotSchema,
  filmBookingSchema,
  filmInquirySchema,
};
