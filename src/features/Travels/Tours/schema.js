const Joi = require("joi");

const weekday = Joi.string().valid(
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
);

const tourSchema = Joi.object({
  title: Joi.string().required(),
  shortDescription: Joi.string().optional(),
  fullDescription: Joi.string().required(),
  pricePerTicket: Joi.number().min(0).required(),
  duration: Joi.string().optional(),
  startTime: Joi.string().optional(),
  endTime: Joi.string().optional(),
  meetingPoint: Joi.string().required(),
  mapLink: Joi.string().uri().optional(),
  venueName: Joi.string().optional(),
  venueAddress: Joi.string().optional(),
  availableDays: Joi.array().items(weekday).min(1).max(7).required(),
  maxParticipants: Joi.number().integer().min(1).optional(),
  perks: Joi.array().items(Joi.string()).optional(),
  gallery: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
  createdBy: Joi.string().uuid().optional(),
});

const updateTourSchema = Joi.object({
  title: Joi.string().optional(),
  shortDescription: Joi.string().optional(),
  fullDescription: Joi.string().optional(),
  pricePerTicket: Joi.number().min(0).optional(),
  duration: Joi.string().optional(),
  startTime: Joi.string().optional(),
  meetingPoint: Joi.string().optional(),
  mapLink: Joi.string().uri().optional(),
  startTime: Joi.string().optional(),
  endTime: Joi.string().optional(),
  venueName: Joi.string().optional(),
  venueAddress: Joi.string().optional(),
  availableDays: Joi.array().items(weekday).min(1).max(7).optional(),
  maxParticipants: Joi.number().integer().min(1).optional(),
  perks: Joi.array().items(Joi.string()).optional(),
  gallery: Joi.array().items(Joi.string()).optional(),
  images: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional(),
});

const tourBookingSchema = Joi.object({
  tourId: Joi.string().uuid().required(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  fullName: Joi.string().optional(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  selectedDate: Joi.date().required(),
  numberOfTickets: Joi.number().integer().min(1).required(),
})
  .or("firstName", "fullName")
  .messages({ "object.missing": "First name is required" });

const tourInquirySchema = Joi.object({
  tourId: Joi.string().uuid().optional(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  message: Joi.string().required(),
});

module.exports = {
  tourSchema,
  updateTourSchema,
  tourBookingSchema,
  tourInquirySchema,
};
