const express = require("express");
const leakyBucketLimiter = require("../../middleware/ratelimitter");
const { authenticate } = require("../../middleware/authmiddleware");
const { authorize } = require("../../middleware/rolemiddleware");
const {
  signup,
  login,
  refreshToken,
  logout,
  AdminSignup,
  verifyOtp,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
  getMe,
  updateMe,
  changePassword,
  deleteMe,
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getUsersById,
  approveUser,
  getUsers,
} = require("./controller");

const router = express.Router();

// ===== Sign up & verification =====
router.post("/signup", signup);
router.post("/verify-otp", leakyBucketLimiter, verifyOtp);
router.get("/verify/:code", verifyEmail); // legacy
router.post("/resend-verification", leakyBucketLimiter, resendVerificationCode);

// ===== Session =====
router.post("/login", leakyBucketLimiter, login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

// ===== Password reset =====
router.post("/forgot-password", leakyBucketLimiter, forgotPassword);
router.post("/reset-password", leakyBucketLimiter, resetPassword);

// ===== Profile (current user) =====
router.get("/me", authenticate(), getMe);
router.patch("/me", authenticate(), updateMe);
router.patch("/me/password", authenticate(), changePassword);
router.delete("/me", authenticate(), deleteMe);

// ===== Addresses =====
router.get("/me/addresses", authenticate(), listAddresses);
router.post("/me/addresses", authenticate(), addAddress);
router.patch("/me/addresses/:id", authenticate(), updateAddress);
router.delete("/me/addresses/:id", authenticate(), deleteAddress);
router.patch("/me/addresses/:id/default", authenticate(), setDefaultAddress);

// ===== Admin =====
router.get("/all-user", authorize(["Admin", "SuperAdmin"]), getUsers);
router.patch("/approve/:id", authorize(["Admin", "SuperAdmin"]), approveUser);
router.get("/user/:id", authorize(["Admin", "SuperAdmin"]), getUsersById); // now admin-only

module.exports = router;
