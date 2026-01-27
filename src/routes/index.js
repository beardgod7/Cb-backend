const express = require("express");
const { authenticate } = require("../middleware/authmiddleware");

const authRoutes = require("../features/Authentication/routes");
const events = require("../features/Events/route");
const eventbookings = require("../features/Booking/route");
const event = require("../features/Events/routes");
const paymentRoutes = require("../features/Payment/route");
const tourRoutes = require("../features/Travels/Tours/route");
const tripRoutes = require("../features/Travels/Trips/route");

const router = express.Router();

// Authentication
router.use("/auth", authRoutes);

// Events
router.use("/events", events); // Admin routes (authorize middleware handles auth)
router.use("/event", event); // Public routes
router.use("/eventbooking", eventbookings); // Mixed routes (auth applied per route)

// Payment Gateway
router.use("/payment", paymentRoutes);

// Travels - Tours
router.use("/travels/tours", tourRoutes);

// Travels - Trips
router.use("/travels/trips", tripRoutes);

// Library
const libraryRoutes = require("../features/Library/route");
router.use("/library", libraryRoutes);

// Museum
const museumRoutes = require("../features/Museum/route");
router.use("/museum", museumRoutes);

// Films
const filmRoutes = require("../features/Films/route");
router.use("/films", filmRoutes);

// Bookstore
const bookstoreRoutes = require("../features/Bookstore/route");
router.use("/bookstore", bookstoreRoutes);

// Podcast
const podcastRoutes = require("../features/Podcast/route");
router.use("/podcast", podcastRoutes);

// Catch-All for Undefined Routes
router.use("*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

module.exports = router;
