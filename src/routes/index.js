const express = require("express");
const { authenticate } = require("../middleware/authmiddleware");
//const { authorize } = require("../middleware/authmiddleware");

const authRoutes = require("../features/Authentication/routes");
const events = require("../features/Events/route");
const eventbookings = require("../features/Booking/route");
const event = require("../features/Events/routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/events", authenticate(), events);
router.use("/event", event);
router.use("/eventbooking", authenticate(), eventbookings);

// Catch-All for Undefined Routes
router.use("*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

module.exports = router;
