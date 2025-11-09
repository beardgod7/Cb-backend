const repository = require("./repository");
const { tripSchema, updateTripSchema, tripBookingSchema, tripInquirySchema } = require("./schema");
const { uploadToCloudinary, deleteFromCloudinary } = require("../../../service/upload/cloudinaryuploader");
const { generateTicketId, generateQRCode } = require("../../../utils/ticketGenerator");
const { exportTripBookingsToCSV } = require("../../../utils/exportHelper");
const { sendTripConfirmation } = require("../../../service/emailservice");

// ==================
// Trips CRUD (Admin)
// ==================

async function createTrip(req, res, next) {
  try {
    const userId = req.userId;
    const imageUrls = [];
    const folderName = "Trips";

    if (req.files && req.files.images) {
      const files = req.files.images.slice(0, 10);
      for (const file of files) {
        const url = await uploadToCloudinary(
          file.buffer,
          folderName,
          `${userId}-${file.originalname}`
        );
        imageUrls.push(url);
      }
    }

    const tripData = {
      ...req.body,
      images: imageUrls,
      createdBy: userId,
    };

    // Parse itinerary if it's a string
    if (typeof tripData.itinerary === "string") {
      tripData.itinerary = JSON.parse(tripData.itinerary);
    }

    const validatedData = await tripSchema.validateAsync(tripData);
    const newTrip = await repository.createTrip(validatedData);

    return res.status(201).json({
      message: "Trip created successfully",
      trip: newTrip,
    });
  } catch (err) {
    console.error("Error creating trip:", err);
    next(err);
  }
}

async function updateTrip(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const imageUrls = [];
    const folderName = "Trips";

    if (req.files && req.files.images) {
      const files = req.files.images.slice(0, 10);
      for (const file of files) {
        const url = await uploadToCloudinary(
          file.buffer,
          folderName,
          `${userId}-${file.originalname}`
        );
        imageUrls.push(url);
      }
    }

    const updateData = {
      ...req.body,
      images: imageUrls.length > 0 ? imageUrls : undefined,
    };

    // Parse itinerary if it's a string
    if (typeof updateData.itinerary === "string") {
      updateData.itinerary = JSON.parse(updateData.itinerary);
    }

    const validatedData = await updateTripSchema.validateAsync(updateData);
    const updatedTrip = await repository.updateTrip(id, validatedData);

    return res.status(200).json({
      message: "Trip updated successfully",
      trip: updatedTrip,
    });
  } catch (err) {
    console.error("Error updating trip:", err);
    next(err);
  }
}

async function deleteTrip(req, res, next) {
  try {
    const { id } = req.params;
    await repository.deleteTrip(id);

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (err) {
    console.error("Error deleting trip:", err);
    next(err);
  }
}

// ==================
// Trips Public
// ==================

async function getAllTrips(req, res, next) {
  try {
    const { type, upcoming } = req.query;
    
    const filter = {};
    if (type) filter.destinationType = type;
    if (upcoming === "true") filter.upcoming = true;

    const trips = await repository.getAllTrips(filter);
    
    res.status(200).json({
      message: "Trips retrieved successfully",
      data: trips,
    });
  } catch (err) {
    next(err);
  }
}

async function getTripById(req, res, next) {
  try {
    const { id } = req.params;
    const trip = await repository.getTripById(id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({
      message: "Trip retrieved successfully",
      data: trip,
    });
  } catch (err) {
    next(err);
  }
}

// ==================
// Trip Bookings
// ==================

async function bookTrip(req, res, next) {
  try {
    const validatedData = await tripBookingSchema.validateAsync(req.body);
    const userId = req.userId || null;

    const trip = await repository.getTripById(validatedData.tripId);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (!trip.isActive) {
      return res.status(400).json({ message: "Trip is not available for booking" });
    }

    // Check capacity
    if (trip.maxParticipants) {
      const availableSpots = trip.maxParticipants - trip.currentBookings;
      if (validatedData.numberOfTickets > availableSpots) {
        return res.status(400).json({
          message: `Only ${availableSpots} spots available`,
        });
      }
    }

    const totalAmount = trip.pricePerPerson * validatedData.numberOfTickets;

    const bookingData = {
      ...validatedData,
      userId,
      totalAmount,
    };

    const booking = await repository.createTripBooking(bookingData);

    res.status(201).json({
      message: "Trip booking created successfully. Please proceed to payment.",
      booking: {
        id: booking.id,
        tripId: booking.tripId,
        totalAmount: booking.totalAmount,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (err) {
    console.error("Error booking trip:", err);
    next(err);
  }
}

async function confirmTripPayment(req, res, next) {
  try {
    const { bookingId } = req.params;
    const { paymentId, paymentStatus } = req.body;

    const booking = await repository.getTripBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (paymentStatus === "success") {
      const ticketId = generateTicketId("TRIP");
      const qrCode = await generateQRCode(ticketId);

      await repository.updateTripBookingPayment(
        bookingId,
        paymentStatus,
        paymentId,
        ticketId,
        qrCode
      );

      // Increment trip bookings count
      await repository.incrementTripBookings(booking.tripId, booking.numberOfTickets);

      const trip = await repository.getTripById(booking.tripId);

      await sendTripConfirmation(
        booking.email,
        {
          title: trip.title,
          destination: trip.destination,
          startDate: trip.startDate,
          endDate: trip.endDate,
          itinerary: trip.itinerary,
          mapLink: trip.mapLink,
        },
        {
          fullName: booking.fullName,
          numberOfTickets: booking.numberOfTickets,
          ticketId,
          qrCode,
        }
      );

      res.status(200).json({
        message: "Payment confirmed. Ticket sent to your email.",
        ticketId,
      });
    } else {
      await repository.updateTripBookingPayment(bookingId, paymentStatus, paymentId, null, null);
      res.status(400).json({ message: "Payment failed" });
    }
  } catch (err) {
    console.error("Error confirming payment:", err);
    next(err);
  }
}

// ==================
// Trip Bookings (Admin)
// ==================

async function getAllTripBookings(req, res, next) {
  try {
    const bookings = await repository.getAllTripBookings();
    res.status(200).json({
      message: "Trip bookings retrieved successfully",
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
}

async function getTripBookingsByTrip(req, res, next) {
  try {
    const { tripId } = req.params;
    const bookings = await repository.getTripBookingsByTripId(tripId);

    res.status(200).json({
      message: "Trip bookings retrieved successfully",
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
}

async function exportTripBookings(req, res, next) {
  try {
    const { tripId } = req.params;
    const bookings = await repository.getTripBookingsByTripId(tripId);

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this trip" });
    }

    const csv = exportTripBookingsToCSV(bookings);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=trip-bookings-${tripId}.csv`);
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
}

async function resendTripTicket(req, res, next) {
  try {
    const { bookingId } = req.params;
    const booking = await repository.getTripBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.paymentStatus !== "success") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const trip = await repository.getTripById(booking.tripId);

    await sendTripConfirmation(
      booking.email,
      {
        title: trip.title,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        itinerary: trip.itinerary,
        mapLink: trip.mapLink,
      },
      {
        fullName: booking.fullName,
        numberOfTickets: booking.numberOfTickets,
        ticketId: booking.ticketId,
        qrCode: booking.qrCode,
      }
    );

    res.status(200).json({ message: "Ticket resent successfully" });
  } catch (err) {
    next(err);
  }
}

// ==================
// Trip Inquiries
// ==================

async function createTripInquiry(req, res, next) {
  try {
    const validatedData = await tripInquirySchema.validateAsync(req.body);
    const inquiry = await repository.createTripInquiry(validatedData);

    res.status(201).json({
      message: "Inquiry submitted successfully",
      inquiry,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllTripInquiries(req, res, next) {
  try {
    const inquiries = await repository.getAllTripInquiries();
    res.status(200).json({
      message: "Inquiries retrieved successfully",
      data: inquiries,
    });
  } catch (err) {
    next(err);
  }
}

async function updateTripInquiryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const inquiry = await repository.updateTripInquiryStatus(id, status, adminResponse);

    res.status(200).json({
      message: "Inquiry updated successfully",
      inquiry,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTrip,
  updateTrip,
  deleteTrip,
  getAllTrips,
  getTripById,
  bookTrip,
  confirmTripPayment,
  getAllTripBookings,
  getTripBookingsByTrip,
  exportTripBookings,
  resendTripTicket,
  createTripInquiry,
  getAllTripInquiries,
  updateTripInquiryStatus,
};
