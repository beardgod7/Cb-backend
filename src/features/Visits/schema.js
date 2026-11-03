const Joi = require("joi");

const createVisitSchema = Joi.object({
  resourceType: Joi.string().valid("library", "archive").required(),
  resourceId: Joi.string().required(),
  visitDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({
    "string.pattern.base": "visitDate must be YYYY-MM-DD",
  }),
  note: Joi.string().allow("").optional(),
});

const reviewVisitSchema = Joi.object({
  status: Joi.string().valid("approved", "declined").required(),
  adminNote: Joi.string().allow("").optional(),
});

const settingsSchema = Joi.object({
  openWeekdays: Joi.array().items(Joi.number().integer().min(0).max(6)).optional(),
  closedDates: Joi.array().items(Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  dailyCapacity: Joi.number().integer().min(0).optional(),
  leadDays: Joi.number().integer().min(0).optional(),
}).min(1);

module.exports = { createVisitSchema, reviewVisitSchema, settingsSchema };
