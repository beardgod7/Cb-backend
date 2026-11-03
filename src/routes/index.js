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
const eventExtras = require("../features/Events/extras");
router.get("/events/:id/calendar.ics", eventExtras.getEventCalendar); // spec path
router.get("/event/albums", eventExtras.getAlbumsByEvent); // ?eventId=
router.use("/events", events); // Admin routes (authorize middleware handles auth)
router.use("/event", event); // Public routes
router.use("/eventbooking", eventbookings); // Mixed routes (auth applied per route)

// Payment Gateway
router.use("/payment", paymentRoutes);

// Travels - combined (user's bookings across tours + trips)
const travelsExtras = require("../features/Travels/extras");
const { authenticate: authTravels } = require("../middleware/authmiddleware");
router.get("/travels/bookings/me", authTravels(), travelsExtras.myBookings);

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
router.use("/podcast", podcastRoutes); // legacy alias
router.use("/podcasts", podcastRoutes); // spec path

// Newsletter (paths are absolute: /newsletter/* and /admin/newsletter/*)
const newsletterRoutes = require("../features/Newsletter/route");
router.use("/", newsletterRoutes);

// Merchandise & Orders (absolute paths: /merchandise/*, /orders/*, /admin/*)
const merchandiseRoutes = require("../features/Merchandise/route");
router.use("/", merchandiseRoutes);

// Visits (shared by Library + Archives): /visits/*, /admin/visits/*
const visitRoutes = require("../features/Visits/route");
router.use("/", visitRoutes);

// Archives: /archives/*, /admin/archives/*
const archiveRoutes = require("../features/Archives/route");
router.use("/", archiveRoutes);

// Programmes: /programmes/*, /admin/programmes/*
const programmeRoutes = require("../features/Programmes/route");
router.use("/", programmeRoutes);

// Health check
const healthRoutes = require("../features/Health/route");
router.use("/health", healthRoutes);

// Catch-All for Undefined Routes
router.use("*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

module.exports = router;
