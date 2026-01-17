const express = require("express");
const router = express.Router();
const filmController = require("./controller");
const { upload } = require("../../middleware/upload");
const { authenticate } = require("../../middleware/authmiddleware");
const { authorize } = require("../../middleware/rolemiddleware");

// ==================
// Public Routes
// ==================

// Films
router.get("/films", filmController.getAllFilms);
router.get("/films/featured", filmController.getFeaturedFilms);
router.get("/films/:id", filmController.getFilmById);

// Screening Slots
router.get("/screening-slots/:filmId", filmController.getScreeningSlotsByFilm);

// Inquiries
router.post("/inquiries", filmController.createFilmInquiry);

// ==================
// User Routes (Authenticated)
// ==================

// Bookings
router.post("/bookings", authenticate(), filmController.bookFilmScreening);
router.post("/bookings/confirm-payment/:bookingId", authenticate(), filmController.confirmFilmPayment);
router.get("/bookings/user/:userId", authenticate(), filmController.getUserFilmBookings);

// ==================
// Admin Routes
// ==================

// Films Management
router.post(
  "/admin/films",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "thumbnails", maxCount: 10 },
    { name: "previewVideo", maxCount: 1 },
    { name: "fullVideo", maxCount: 1 },
  ]),
  filmController.createFilm
);
router.put(
  "/admin/films/:id",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "thumbnails", maxCount: 10 },
    { name: "previewVideo", maxCount: 1 },
    { name: "fullVideo", maxCount: 1 },
  ]),
  filmController.updateFilm
);
router.delete(
  "/admin/films/:id",
  authorize(["Admin", "SuperAdmin"]),
  filmController.deleteFilm
);

// Screening Slots Management
router.post(
  "/admin/screening-slots",
  authorize(["Admin", "SuperAdmin"]),
  filmController.createScreeningSlot
);
router.put(
  "/admin/screening-slots/:id",
  authorize(["Admin", "SuperAdmin"]),
  filmController.updateScreeningSlot
);
router.delete(
  "/admin/screening-slots/:id",
  authorize(["Admin", "SuperAdmin"]),
  filmController.deleteScreeningSlot
);

// Bookings Management
router.get(
  "/admin/bookings",
  authorize(["Admin", "SuperAdmin"]),
  filmController.getAllFilmBookings
);
router.patch(
  "/admin/bookings/:id",
  authorize(["Admin", "SuperAdmin"]),
  filmController.updateFilmBookingStatus
);
router.get(
  "/admin/bookings/export",
  authorize(["Admin", "SuperAdmin"]),
  filmController.exportFilmBookings
);

// Inquiries Management
router.get(
  "/admin/inquiries",
  authorize(["Admin", "SuperAdmin"]),
  filmController.getAllFilmInquiries
);
router.patch(
  "/admin/inquiries/:id",
  authorize(["Admin", "SuperAdmin"]),
  filmController.updateFilmInquiryStatus
);

module.exports = router;
