const Joi = require("joi");

// Define the main appointment schema
const EventBookingSchema = Joi.object({
  //userId: Joi.string().uuid().optional(),
  EventId: Joi.string().uuid().required(),
  FirstName: Joi.string().max(255).optional(),
  LastName: Joi.string().max(255).optional(),
  PhoneNumber: Joi.string().max(255).optional(),
  status: Joi.string().valid("Register", "Volunteer", "Sponsor").optional(),
  Email: Joi.string().email().optional(),
}).unknown(true); // allow extra fields without errors

// const updateEventBookingSchema = Joi.object({
//   // userId: Joi.string().uuid().optional(),
//   EventId: Joi.string().uuid().optional(),
//   FirstName: Joi.string().max(255).optional(),
//   LastName: Joi.string().max(255).optional(),
//   PhoneNumber: Joi.string().max(255).optional(),
//   status: Joi.string().valid("Register", "Volunteer", "Sponsor").optional(),
//   Email: Joi.string().email().optional(),
//   metadata: Joi.object().unknown(true).optional(),
// });

module.exports = {
  EventBookingSchema,
};
