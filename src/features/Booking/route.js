const express = require("express");
const router = express.Router();
const eventController = require("./controller");

// Admin: manage reusable form fields
router.post("/admin/form-fields", eventController.createOrUpdateTemplate);
router.get("/admin/:EventId", eventController.getTemplate);

// User: event bookings
router.post("/book", eventController.createEventBooking);
router.get("/bookings", eventController.getAllBookings);
router.get("/bookings/user/:userId", eventController.getBookingsByUser);
router.get("/bookings/:id", eventController.getBookingById);
//router.put("/bookings/:id", eventController.updateBooking);
router.delete("/bookings/:id", eventController.deleteBooking);

module.exports = router;
