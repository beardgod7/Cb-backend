const express = require("express");
const router = express.Router();
const paymentController = require("./controller");
const { authenticate } = require("../../middleware/authmiddleware");
const { authorize } = require("../../middleware/rolemiddleware");

// Initialization and verification
router.post("/initialize", authenticate(), paymentController.initializePayment);
router.get("/verify/:reference", paymentController.verifyPayment);

// Payment history
router.get("/history/me", authenticate(), paymentController.getPaymentHistoryMe);
router.get(
  "/history/:userId",
  authorize(["Admin", "SuperAdmin"]),
  paymentController.getPaymentHistory
);

// Bank transfer
router.get("/bank-details", paymentController.getBankDetails);
router.post("/transfer-notices", authenticate(), paymentController.createTransferNotice);
router.get("/transfer-notices/me", authenticate(), paymentController.getMyTransferNotices);
router.get(
  "/admin/transfer-notices",
  authorize(["Admin", "SuperAdmin"]),
  paymentController.listTransferNotices
);
router.patch(
  "/admin/transfer-notices/:id",
  authorize(["Admin", "SuperAdmin"]),
  paymentController.reviewTransferNotice
);

// Admin
router.get(
  "/admin/transactions",
  authorize(["Admin", "SuperAdmin"]),
  paymentController.getAllTransactions
);
router.get(
  "/admin/statistics",
  authorize(["Admin", "SuperAdmin"]),
  paymentController.getPaymentStatistics
);

// Webhooks (no auth)
router.post("/webhook/paystack", paymentController.paystackWebhook);
router.post("/webhook/flutterwave", paymentController.flutterwaveWebhook);
router.post("/webhook/stripe", paymentController.stripeWebhook);

module.exports = router;
