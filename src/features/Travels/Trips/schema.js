const Joi = require("joi");

const tripSchema = Joi.object({
  title: Joi.string().required(),
  destination: Joi.string().required(),
  destinationType: Joi.string().valid("local", "international").required(),
  shortDescription: Joi.string().optional(),
  fullDescription: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref("startDate")).required(),
  pricePerPerson: Joi.number().min(0).required(),
  itinerary: Joi.array()
    .items(
      Joi.object({
        day: Joi.number().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        activities: Joi.array().items(Joi.string()).optional(),
      })
    )
    .optional(),
  mapLink: Joi.string().uri().optional(),
  images: Joi.array().items(Joi.string()).optional(),
  maxParticipants: Joi.number().integer().min(1).optional(),
  isActive: Joi.boolean().optional(),
  createdBy: Joi.string().uuid().optional(),
});

const updateTripSchema = Joi.object({
  title: Joi.string().optional(),
  destination: Joi.string().optional(),
  destinationType: Joi.string().valid("local", "international").optional(),
  shortDescription: Joi.string().optional(),
  fullDescription: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  pricePerPerson: Joi.number().min(0).optional(),
  itinerary: Joi.array()
    .items(
      Joi.object({
        day: Joi.number().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        activities: Joi.array().items(Joi.string()).optional(),
      })
    )
    .optional(),
  mapLink: Joi.string().uri().optional(),
  images: Joi.array().items(Joi.string()).optional(),
  maxParticipants: Joi.number().integer().min(1).optional(),
  isActive: Joi.boolean().optional(),
});

const tripBookingSchema = Joi.object({
  tripId: Joi.string().uuid().required(),
  fullName: Joi.string().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  numberOfTickets: Joi.number().integer().min(1).required(),
});

const tripInquirySchema = Joi.object({
  tripId: Joi.string().uuid().optional(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  message: Joi.string().required(),
});

module.exports = {
  tripSchema,
  updateTripSchema,
  tripBookingSchema,
  tripInquirySchema,
};
