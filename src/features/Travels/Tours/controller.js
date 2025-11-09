const repository = require("./repository");
const { tourSchema, updateTourSchema, tourBookingSchema, tourInquirySchema } = require("./schema");
const { uploadToCloudinary, deleteFromCloudinary } = require("../../../service/upload/cloudinaryuploader");
const { generateTicketId, generateQRCode } = require("../../../utils/ticketGenerator");
const { getAvailableTourDates } = require("../../../utils/calendarHelper");
const { exportTourBookingsToCSV } = require("../../../utils/exportHelper");
const { sendTourConfirmation } = require("../../../service/emailservice");

// ==================
// Tours CRUD (Admin)
// ==================

async function createTour(req, res, next) {
  try {
    const userId = req.userId;
    const imageUrls = [];
    const folderName = "Tours";

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

    const tourData = {
      ...req.body,
      images: imageUrls,
      createdBy: userId,
    };

    const validatedData = await tourSchema.validateAsync(tourData);
    const newTour = await repository.createTour(validatedData);

    return res.status(201).json({
      message: "Tour created successfully",
      tour: newTour,
    });
  } catch (err) {
    console.error("Error creating tour:", err);
    next(err);
  }
}

async function updateTour(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const imageUrls = [];
    const folderName = "Tours";

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

    const validatedData = await updateTourSchema.validateAsync(updateData);
    const updatedTour = await repository.updateTour(id, validatedData);

    return res.status(200).json({
      message: "Tour updated successfully",
      tour: updatedTour,
    });
  } catch (err) {
    console.error("Error updating tour:", err);
    next(err);
  }
}

async function deleteTour(req, res, next) {
  try {
    const { id } = req.params;
    await repository.deleteTour(id);

    res.status(200).json({ message: "Tour deleted successfully" });
  } catch (err) {
    console.error("Error deleting tour:", err);
    next(err);
  }
}

// ==================
// Tours Public
// ==================

async function getAllTours(req, res, next) {
  try {
    const tours = await repository.getAllTours();
    res.status(200).json({
      message: "Tours retrieved successfully",
      data: tours,
    });
  } catch (err) {
    next(err);
  }
}

async function getTourById(req, res, next) {
  try {
    const { id } = req.params;
    const tour = await repository.getTourById(id);

    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.status(200).json({
      message: "Tour retrieved successfully",
      data: tour,
    });
  } catch (err) {
    next(err);
  }
}

async function getTourCalendar(req, res, next) {
  try {
    const { tourId } = req.params;
    const { month, year } = req.query;

    const tour = await repository.getTourById(tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const availableDates = getAvailableTourDates(
      tour.availableDays,
      parseInt(month),
      parseInt(year)
    );

    res.status(200).json({
      message: "Available dates retrieved successfully",
      data: {
        tourId,
        availableDays: tour.availableDays,
        dates: availableDates,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ==================
// Tour Bookings
// ==================

async function bookTour(req, res, next) {
  try {
    const validatedData = await tourBookingSchema.validateAsync(req.body);
    const userId = req.userId || null;

    const tour = await repository.getTourById(validatedData.tourId);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    if (!tour.isActive) {
      return res.status(400).json({ message: "Tour is not available for booking" });
    }

    const totalAmount = tour.pricePerTicket * validatedData.numberOfTickets;

    const bookingData = {
      ...validatedData,
      userId,
      totalAmount,
    };

    const booking = await repository.createTourBooking(bookingData);

    res.status(201).json({
      message: "Tour booking created successfully. Please proceed to payment.",
      booking: {
        id: booking.id,
        tourId: booking.tourId,
        totalAmount: booking.totalAmount,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (err) {
    console.error("Error booking tour:", err);
    next(err);
  }
}

async function confirmTourPayment(req, res, next) {
  try {
    const { bookingId } = req.params;
    const { paymentId, paymentStatus } = req.body;

    const booking = await repository.getTourBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (paymentStatus === "success") {
      const ticketId = generateTicketId("TOUR");
      const qrCode = await generateQRCode(ticketId);

      await repository.updateTourBookingPayment(
        bookingId,
        paymentStatus,
        paymentId,
        ticketId,
        qrCode
      );

      const tour = await repository.getTourById(booking.tourId);

      await sendTourConfirmation(
        booking.email,
        {
          title: tour.title,
          date: booking.selectedDate,
          time: tour.startTime,
          meetingPoint: tour.meetingPoint,
          mapLink: tour.mapLink,
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
      await repository.updateTourBookingPayment(bookingId, paymentStatus, paymentId, null, null);
      res.status(400).json({ message: "Payment failed" });
    }
  } catch (err) {
    console.error("Error confirming payment:", err);
    next(err);
  }
}

// ==================
// Tour Bookings (Admin)
// ==================

async function getAllTourBookings(req, res, next) {
  try {
    const bookings = await repository.getAllTourBookings();
    res.status(200).json({
      message: "Tour bookings retrieved successfully",
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
}

async function getTourBookingsByTour(req, res, next) {
  try {
    const { tourId } = req.params;
    const bookings = await repository.getTourBookingsByTourId(tourId);

    res.status(200).json({
      message: "Tour bookings retrieved successfully",
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
}

async function exportTourBookings(req, res, next) {
  try {
    const { tourId } = req.params;
    const bookings = await repository.getTourBookingsByTourId(tourId);

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this tour" });
    }

    const csv = exportTourBookingsToCSV(bookings);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=tour-bookings-${tourId}.csv`);
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
}

async function resendTourTicket(req, res, next) {
  try {
    const { bookingId } = req.params;
    const booking = await repository.getTourBookingById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.paymentStatus !== "success") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const tour = await repository.getTourById(booking.tourId);

    await sendTourConfirmation(
      booking.email,
      {
        title: tour.title,
        date: booking.selectedDate,
        time: tour.startTime,
        meetingPoint: tour.meetingPoint,
        mapLink: tour.mapLink,
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
// Tour Inquiries
// ==================

async function createTourInquiry(req, res, next) {
  try {
    const validatedData = await tourInquirySchema.validateAsync(req.body);
    const inquiry = await repository.createTourInquiry(validatedData);

    res.status(201).json({
      message: "Inquiry submitted successfully",
      inquiry,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllTourInquiries(req, res, next) {
  try {
    const inquiries = await repository.getAllTourInquiries();
    res.status(200).json({
      message: "Inquiries retrieved successfully",
      data: inquiries,
    });
  } catch (err) {
    next(err);
  }
}

async function updateTourInquiryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const inquiry = await repository.updateTourInquiryStatus(id, status, adminResponse);

    res.status(200).json({
      message: "Inquiry updated successfully",
      inquiry,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTour,
  updateTour,
  deleteTour,
  getAllTours,
  getTourById,
  getTourCalendar,
  bookTour,
  confirmTourPayment,
  getAllTourBookings,
  getTourBookingsByTour,
  exportTourBookings,
  resendTourTicket,
  createTourInquiry,
  getAllTourInquiries,
  updateTourInquiryStatus,
};
