const express = require("express");
const router = express.Router();
const eventController = require("./controller");
const { authorize } = require("../../middleware/rolemiddleware");

const { authenticate } = require("../../middleware/authmiddleware");

// Admin: manage reusable form fields
router.post("/admin/form-fields", authorize(["Admin", "SuperAdmin"]), eventController.createOrUpdateTemplate);
router.get("/admin/:EventId", authorize(["Admin", "SuperAdmin"]), eventController.getTemplate);

// User: event bookings (authentication required)
router.post("/book", authenticate(), eventController.createEventBooking);
router.get("/bookings/user/:userId", authenticate(), eventController.getBookingsByUser);
router.get("/bookings/:id", authenticate(), eventController.getBookingById);
router.delete("/bookings/:id", authenticate(), eventController.deleteBooking);

// Admin: view all bookings
router.get("/bookings", authorize(["Admin", "SuperAdmin"]), eventController.getAllBookings);

// Admin: event-specific bookings management
router.get("/bookings/event/:eventId", authorize(["Admin", "SuperAdmin"]), eventController.getBookingsByEvent);
router.get("/export/:eventId", authorize(["Admin", "SuperAdmin"]), eventController.exportAttendees);
router.post("/broadcast/:eventId", authorize(["Admin", "SuperAdmin"]), eventController.sendBroadcast);
router.post("/update-email/:eventId", authorize(["Admin", "SuperAdmin"]), eventController.sendUpdate);
router.patch("/bookings/:id/status", authorize(["Admin", "SuperAdmin"]), eventController.updateBookingStatus);
router.get("/stats/:eventId", authorize(["Admin", "SuperAdmin"]), eventController.getStats);

module.exports = router;
