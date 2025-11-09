const express = require("express");
const router = express.Router();
const tourController = require("./controller");
const { upload } = require("../../../middleware/upload");
const { authenticate } = require("../../../middleware/authmiddleware");
const { authorize } = require("../../../middleware/rolemiddleware");

// Public routes (no authentication required)
router.get("/", tourController.getAllTours);
router.get("/:id", tourController.getTourById);
router.get("/calendar/:tourId", tourController.getTourCalendar);
router.post("/inquire", tourController.createTourInquiry);

// User routes (authentication required)
router.post("/book", authenticate(), tourController.bookTour);
router.post("/confirm-payment/:bookingId", authenticate(), tourController.confirmTourPayment);

// Admin routes - Tour management
router.post(
  "/admin/tours",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([{ name: "images", maxCount: 10 }]),
  tourController.createTour
);
router.put(
  "/admin/tours/:id",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([{ name: "images", maxCount: 10 }]),
  tourController.updateTour
);
router.delete(
  "/admin/tours/:id",
  authorize(["Admin", "SuperAdmin"]),
  tourController.deleteTour
);

// Admin routes - Booking management
router.get(
  "/admin/bookings",
  authorize(["Admin", "SuperAdmin"]),
  tourController.getAllTourBookings
);
router.get(
  "/admin/bookings/tour/:tourId",
  authorize(["Admin", "SuperAdmin"]),
  tourController.getTourBookingsByTour
);
router.get(
  "/admin/export/:tourId",
  authorize(["Admin", "SuperAdmin"]),
  tourController.exportTourBookings
);
router.post(
  "/admin/resend/:bookingId",
  authorize(["Admin", "SuperAdmin"]),
  tourController.resendTourTicket
);

// Admin routes - Inquiry management
router.get(
  "/admin/inquiries",
  authorize(["Admin", "SuperAdmin"]),
  tourController.getAllTourInquiries
);
router.patch(
  "/admin/inquiries/:id",
  authorize(["Admin", "SuperAdmin"]),
  tourController.updateTourInquiryStatus
);

module.exports = router;
