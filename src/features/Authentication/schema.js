const Joi = require("joi");

// Public sign-up (step 1): name, email, password. Role is NOT accepted here.
const signupSchema = Joi.object({
  name: Joi.string().trim().min(1).optional(),
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters",
  }),
})
  .or("name", "firstName")
  .messages({ "object.missing": "Name is required" });

// Signin schema
const signinSchema = Joi.object({
  identifier: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

// OTP verification: tied to the email + 5-digit (or 6-digit) code.
const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string()
    .pattern(/^\d{5,6}$/)
    .required()
    .messages({ "string.pattern.base": "Enter the code we sent you" }),
});

// Step 2: profession / country / state (and optional name/phone edits via PATCH /auth/me)
const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  phoneNumber: Joi.string().trim().allow("").optional(),
  profession: Joi.string().trim().optional(),
  country: Joi.string().trim().optional(),
  state: Joi.string().trim().optional(),
}).min(1);

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters",
  }),
});

const deleteAccountSchema = Joi.object({
  password: Joi.string().required(),
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
  password: Joi.string().min(8).required(),
});

const resendVerificationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "A valid email address is required.",
    "any.required": "Email is required.",
  }),
});

const addressSchema = Joi.object({
  label: Joi.string().trim().optional(),
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  phone: Joi.string().trim().optional(),
  address: Joi.string().trim().required(),
  country: Joi.string().trim().required(),
  state: Joi.string().trim().required(),
  city: Joi.string().trim().allow("").optional(),
  postalCode: Joi.string().trim().allow("").optional(),
  isDefault: Joi.boolean().optional(),
});

const updateAddressSchema = addressSchema.fork(
  ["address", "country", "state"],
  (s) => s.optional()
).min(1);

module.exports = {
  signupSchema,
  signinSchema,
  verifyOtpSchema,
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendVerificationSchema,
  addressSchema,
  updateAddressSchema,
};
