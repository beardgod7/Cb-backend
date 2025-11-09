const express = require("express");
const router = express.Router();
const tripController = require("./controller");
const { upload } = require("../../../middleware/upload");
const { authenticate } = require("../../../middleware/authmiddleware");
const { authorize } = require("../../../middleware/rolemiddleware");

// Public routes (no authentication required)
router.get("/", tripController.getAllTrips);
router.get("/:id", tripController.getTripById);
router.post("/inquire", tripController.createTripInquiry);

// User routes (authentication required)
router.post("/book", authenticate(), tripController.bookTrip);
router.post("/confirm-payment/:bookingId", authenticate(), tripController.confirmTripPayment);

// Admin routes - Trip management
router.post(
  "/admin/trips",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([{ name: "images", maxCount: 10 }]),
  tripController.createTrip
);
router.put(
  "/admin/trips/:id",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([{ name: "images", maxCount: 10 }]),
  tripController.updateTrip
);
router.delete(
  "/admin/trips/:id",
  authorize(["Admin", "SuperAdmin"]),
  tripController.deleteTrip
);

// Admin routes - Booking management
router.get(
  "/admin/bookings",
  authorize(["Admin", "SuperAdmin"]),
  tripController.getAllTripBookings
);
router.get(
  "/admin/bookings/trip/:tripId",
  authorize(["Admin", "SuperAdmin"]),
  tripController.getTripBookingsByTrip
);
router.get(
  "/admin/export/:tripId",
  authorize(["Admin", "SuperAdmin"]),
  tripController.exportTripBookings
);
router.post(
  "/admin/resend/:bookingId",
  authorize(["Admin", "SuperAdmin"]),
  tripController.resendTripTicket
);

// Admin routes - Inquiry management
router.get(
  "/admin/inquiries",
  authorize(["Admin", "SuperAdmin"]),
  tripController.getAllTripInquiries
);
router.patch(
  "/admin/inquiries/:id",
  authorize(["Admin", "SuperAdmin"]),
  tripController.updateTripInquiryStatus
);

module.exports = router;
