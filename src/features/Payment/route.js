const express = require("express");
const router = express.Router();
const paymentController = require("./controller");
const { authenticate } = require("../../middleware/authmiddleware");
const { authorize } = require("../../middleware/rolemiddleware");

// Payment initialization and verification
router.post("/initialize", paymentController.initializePayment);
router.get("/verify/:reference", paymentController.verifyPayment);

// User payment history
router.get("/history/:userId", authenticate(), paymentController.getPaymentHistory);

// Admin routes
router.get("/admin/transactions", authorize(["Admin", "SuperAdmin"]), paymentController.getAllTransactions);
router.get("/admin/statistics", authorize(["Admin", "SuperAdmin"]), paymentController.getPaymentStatistics);

// Webhooks (no authentication needed)
router.post("/webhook/paystack", paymentController.paystackWebhook);
router.post("/webhook/flutterwave", paymentController.flutterwaveWebhook);
router.post("/webhook/stripe", paymentController.stripeWebhook);

module.exports = router;
