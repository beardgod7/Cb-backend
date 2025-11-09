const Joi = require("joi");

// Signup schema
const signupSchema = Joi.object({
  username: Joi.string().optional(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().optional(),
  password: Joi.string().min(8).required(),
  role: Joi.string()
    .valid("Admin", "User", "Driver", "TruckOwner")
    .default("User"),
});

// Signin schema
const signinSchema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

// Refresh token schema
const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

const resendVerificationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "A valid email address is required.",
    "any.required": "Email is required.",
  }),
});

module.exports = {
  signupSchema,
  signinSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendVerificationSchema,
};
