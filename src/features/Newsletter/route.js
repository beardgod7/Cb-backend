const express = require("express");
const router = express.Router();
const controller = require("./controller");
const leakyBucketLimiter = require("../../middleware/ratelimitter");
const { authorize } = require("../../middleware/rolemiddleware");

// Public — mounted under /newsletter
router.post("/newsletter/subscribe", leakyBucketLimiter, controller.subscribe);
router.get("/newsletter/confirm", controller.confirm);
router.get("/newsletter/unsubscribe", controller.unsubscribe);

// Admin
router.get(
  "/admin/newsletter/subscribers",
  authorize(["Admin", "SuperAdmin"]),
  controller.listSubscribers
);
router.get(
  "/admin/newsletter/export",
  authorize(["Admin", "SuperAdmin"]),
  controller.exportSubscribers
);

module.exports = router;
