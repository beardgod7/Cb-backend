const Joi = require("joi");

// Define the main appointment schema
const EventBookingSchema = Joi.object({
  //userId: Joi.string().uuid().optional(),
  EventId: Joi.string().uuid().required(),
  FirstName: Joi.string().max(255).required(),
  LastName: Joi.string().max(255).required(),
  PhoneNumber: Joi.string().max(255).optional(),
  status: Joi.string().valid("Register", "Volunteer").required(),
  Email: Joi.string().email().required(),
});

const updateEventBookingSchema = Joi.object({
  // userId: Joi.string().uuid().optional(),
  EventId: Joi.string().uuid().optional(),
  FirstName: Joi.string().max(255).optional(),
  LastName: Joi.string().max(255).optional(),
  PhoneNumber: Joi.string().max(255).optional(),
  status: Joi.string().valid("Register", "Volunteer").optional(),
  Email: Joi.string().email().optional(),
});

module.exports = {
  EventBookingSchema,
  updateEventBookingSchema,
};
