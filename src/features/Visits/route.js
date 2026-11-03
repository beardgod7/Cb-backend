const express = require("express");
const router = express.Router();
const c = require("./controller");
const { authenticate } = require("../../middleware/authmiddleware");
const { authorize } = require("../../middleware/rolemiddleware");

const admin = authorize(["Admin", "SuperAdmin"]);

// Public
router.get("/visits/availability", c.availability);

// Client
router.post("/visits", authenticate(), c.createVisit);
router.get("/visits/me", authenticate(), c.myVisits);
router.patch("/visits/:id/cancel", authenticate(), c.cancelVisit);

// Admin
router.get("/admin/visits", admin, c.adminList);
router.get("/admin/visits/settings", admin, c.adminGetSettings);
router.put("/admin/visits/settings", admin, c.adminUpdateSettings);
router.patch("/admin/visits/:id", admin, c.adminReview);

module.exports = router;
