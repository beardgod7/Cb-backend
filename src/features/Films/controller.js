const repository = require("./repository");
const {
  filmSchema,
  updateFilmSchema,
  screeningSlotSchema,
  filmBookingSchema,
  filmInquirySchema,
} = require("./schema");
const { uploadToCloudinary } = require("../../service/upload/cloudinaryuploader");
const { generateTicketId, generateQRCode } = require("../../utils/ticketGenerator");
const { exportFilmBookingsToCSV } = require("../../utils/exportHelper");
const {
  sendFilmBookingConfirmation,
  sendFilmInquiryNotification,
  sendFilmScreeningReminder,
} = require("../../service/emailservice");

// ==================
// Films (Admin)
// ==================

async function createFilm(req, res, next) {
  try {
    const userId = req.userId;
    let coverImageUrl = null;
    const thumbnailUrls = [];
    let previewVideoUrl = null;
    const folderName = "Films";

    // Upload cover image
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      coverImageUrl = await uploadToCloudinary(
        req.files.coverImage[0].buffer,
        folderName,
        `cover-${userId}-${req.files.coverImage[0].originalname}`
      );
    }

    // Upload thumbnail gallery
    if (req.files && req.files.thumbnails) {
      const files = req.files.thumbnails.slice(0, 10);
      for (const file of files) {
        const url = await uploadToCloudinary(
          file.buffer,
          `${folderName}/Thumbnails`,
          `thumb-${userId}-${file.originalname}`
        );
        thumbnailUrls.push(url);
      }
    }

    // Upload preview video
    if (req.files && req.files.previewVideo && req.files.previewVideo[0]) {
      previewVideoUrl = await uploadToCloudinary(
        req.files.previewVideo[0].buffer,
        `${folderName}/Previews`,
        `preview-${userId}-${req.files.previewVideo[0].originalname}`,
        { resource_type: "video" }
      );
    }

    // Upload full video
    let fullVideoUrl = null;
    if (req.files && req.files.fullVideo && req.files.fullVideo[0]) {
      fullVideoUrl = await uploadToCloudinary(
        req.files.fullVideo[0].buffer,
        `${folderName}/FullVideos`,
        `full-${userId}-${req.files.fullVideo[0].originalname}`,
        { resource_type: "video" }
      );
    }

    const filmData = {
      ...req.body,
      coverImage: coverImageUrl,
      thumbnailGallery: thumbnailUrls,
      previewVideo: previewVideoUrl,
      fullVideo: fullVideoUrl,
      createdBy: userId,
    };

    // Parse tags if it's a string
    if (typeof filmData.tags === "string") {
      try {
        if (filmData.tags.trim() === "") {
          filmData.tags = [];
        } else {
          filmData.tags = JSON.parse(filmData.tags);
        }
      } catch (error) {
        console.error("Error parsing tags:", error);
        return res.status(400).json({ 
          message: "Invalid tags format. Tags must be a valid JSON array, e.g., [\"tag1\",\"tag2\"]",
          error: error.message 
        });
      }
    }

    const validatedData = await filmSchema.validateAsync(filmData);
    const film = await repository.createFilm(validatedData);

    res.status(201).json({
      message: "Film created successfully",
      film,
    });
  } catch (err) {
    console.error("Error creating film:", err);
    next(err);
  }
}

async function updateFilm(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    let coverImageUrl = null;
    const thumbnailUrls = [];
    let previewVideoUrl = null;
    const folderName = "Films";

    // Upload new cover image if provided
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      coverImageUrl = await uploadToCloudinary(
        req.files.coverImage[0].buffer,
        folderName,
        `cover-${userId}-${req.files.coverImage[0].originalname}`
      );
    }

    // Upload new thumbnails if provided
    if (req.files && req.files.thumbnails) {
      const files = req.files.thumbnails.slice(0, 10);
      for (const file of files) {
        const url = await uploadToCloudinary(
          file.buffer,
          `${folderName}/Thumbnails`,
          `thumb-${userId}-${file.originalname}`
        );
        thumbnailUrls.push(url);
      }
    }

    // Upload new preview video if provided
    if (req.files && req.files.previewVideo && req.files.previewVideo[0]) {
      previewVideoUrl = await uploadToCloudinary(
        req.files.previewVideo[0].buffer,
        `${folderName}/Previews`,
        `preview-${userId}-${req.files.previewVideo[0].originalname}`,
        { resource_type: "video" }
      );
    }

    // Upload new full video if provided
    let fullVideoUrl = null;
    if (req.files && req.files.fullVideo && req.files.fullVideo[0]) {
      fullVideoUrl = await uploadToCloudinary(
        req.files.fullVideo[0].buffer,
        `${folderName}/FullVideos`,
        `full-${userId}-${req.files.fullVideo[0].originalname}`,
        { resource_type: "video" }
      );
    }

    const updateData = {
      ...req.body,
      coverImage: coverImageUrl || undefined,
      thumbnailGallery: thumbnailUrls.length > 0 ? thumbnailUrls : undefined,
      previewVideo: previewVideoUrl || undefined,
      fullVideo: fullVideoUrl || undefined,
    };

    // Parse tags if it's a string
    if (typeof updateData.tags === "string") {
      try {
        if (updateData.tags.trim() === "") {
          updateData.tags = [];
        } else {
          updateData.tags = JSON.parse(updateData.tags);
        }
      } catch (error) {
        console.error("Error parsing tags:", error);
        return res.status(400).json({ 
          message: "Invalid tags format. Tags must be a valid JSON array, e.g., [\"tag1\",\"tag2\"]",
          error: error.message 
        });
      }
    }

    const validatedData = await updateFilmSchema.validateAsync(updateData);
    const film = await repository.updateFilm(id, validatedData);

    res.status(200).json({
      message: "Film updated successfully",
      film,
    });
  } catch (err) {
    console.error("Error updating film:", err);
    next(err);
  }
}

async function deleteFilm(req, res, next) {
  try {
    const { id } = req.params;
    await repository.deleteFilm(id);

    res.status(200).json({ message: "Film deleted successfully" });
  } catch (err) {
    next(err);
  }
}

// ==================
// Films (Public)
// ==================

async function getAllFilms(req, res, next) {
  try {
    const { category, country, festivalYear, search, featured } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (country) filter.country = country;
    if (festivalYear) filter.festivalYear = festivalYear;
    if (search) filter.search = search;
    if (featured === "true") filter.featured = true;

    const films = await repository.getAllFilms(filter);

    res.status(200).json({
      message: "Films retrieved successfully",
      data: films,
    });
  } catch (err) {
    next(err);
  }
}

async function getFilmById(req, res, next) {
  try {
    const { id } = req.params;
    const film = await repository.getFilmById(id);

    if (!film) {
      return res.status(404).json({ message: "Film not found" });
    }

    res.status(200).json({
      message: "Film retrieved successfully",
      data: film,
    });
  } catch (err) {
    next(err);
  }
}

async function getFeaturedFilms(req, res, next) {
  try {
    const films = await repository.getFeaturedFilms();

    res.status(200).json({
      message: "Featured films retrieved successfully",
      data: films,
    });
  } catch (err) {
    next(err);
  }
}

// ==================
// Screening Slots (Admin)
// ==================

async function createScreeningSlot(req, res, next) {
  try {
    const validatedData = await screeningSlotSchema.validateAsync(req.body);
    const slot = await repository.createScreeningSlot(validatedData);

    res.status(201).json({
      message: "Screening slot created successfully",
      slot,
    });
  } catch (err) {
    next(err);
  }
}

async function getScreeningSlotsByFilm(req, res, next) {
  try {
    const { filmId } = req.params;
    const slots = await repository.getScreeningSlotsByFilm(filmId);

    res.status(200).json({
      message: "Screening slots retrieved successfully",
      data: slots,
    });
  } catch (err) {
    next(err);
  }
}

async function updateScreeningSlot(req, res, next) {
  try {
    const { id } = req.params;
    const slot = await repository.updateScreeningSlot(id, req.body);

    res.status(200).json({
      message: "Screening slot updated successfully",
      slot,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteScreeningSlot(req, res, next) {
  try {
    const { id } = req.params;
    await repository.deleteScreeningSlot(id);

    res.status(200).json({ message: "Screening slot deleted successfully" });
  } catch (err) {
    next(err);
  }
}

// ==================
// Film Bookings
// ==================

async function bookFilmScreening(req, res, next) {
  try {
    const validatedData = await filmBookingSchema.validateAsync(req.body);
    const userId = req.userId || null;

    const slot = await repository.getScreeningSlotById(validatedData.screeningSlotId);
    if (!slot) {
      return res.status(404).json({ message: "Screening slot not found" });
    }

    if (!slot.isAvailable) {
      return res.status(400).json({ message: "Screening slot is fully booked" });
    }

    const availableSeats = slot.maxSeats - slot.bookedSeats;
    if (validatedData.numberOfSeats > availableSeats) {
      return res.status(400).json({
        message: `Only ${availableSeats} seats available`,
      });
    }

    const film = await repository.getFilmById(validatedData.filmId);
    const totalAmount = film.ticketPrice * validatedData.numberOfSeats;

    const bookingData = {
      ...validatedData,
      userId,
      totalAmount,
    };

    const booking = await repository.createFilmBooking(bookingData);

    res.status(201).json({
      message: "Film screening booked successfully. Please proceed to payment.",
      booking: {
        id: booking.id,
        filmId: booking.filmId,
        totalAmount: booking.totalAmount,
        paymentStatus: booking.paymentStatus,
      },
    });
  } catch (err) {
    console.error("Error booking film screening:", err);
    next(err);
  }
}

async function confirmFilmPayment(req, res, next) {
  try {
    const { bookingId } = req.params;
    const { paymentId, paymentStatus } = req.body;

    const booking = await repository.getFilmBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (paymentStatus === "success") {
      const ticketId = generateTicketId("FILM");
      const qrCode = await generateQRCode(ticketId);

      await repository.updateFilmBookingPayment(
        bookingId,
        paymentStatus,
        paymentId,
        ticketId,
        qrCode
      );

      // Increment booked seats
      await repository.incrementBookedSeats(
        booking.screeningSlotId,
        booking.numberOfSeats
      );

      // Send confirmation email
      await sendFilmBookingConfirmation(booking.email, {
        fullName: booking.fullName,
        filmTitle: booking.Film.title,
        screeningDate: booking.ScreeningSlot.screeningDate,
        startTime: booking.ScreeningSlot.startTime,
        numberOfSeats: booking.numberOfSeats,
        ticketId,
        qrCode,
      });

      res.status(200).json({
        message: "Payment confirmed. Ticket sent to your email.",
        ticketId,
      });
    } else {
      await repository.updateFilmBookingPayment(bookingId, paymentStatus, paymentId, null, null);
      res.status(400).json({ message: "Payment failed" });
    }
  } catch (err) {
    console.error("Error confirming payment:", err);
    next(err);
  }
}

async function getAllFilmBookings(req, res, next) {
  try {
    const bookings = await repository.getAllFilmBookings();

    res.status(200).json({
      message: "Film bookings retrieved successfully",
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
}

async function getUserFilmBookings(req, res, next) {
  try {
    const { userId } = req.params;
    const bookings = await repository.getFilmBookingsByUser(userId);

    res.status(200).json({
      message: "User film bookings retrieved successfully",
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
}

async function updateFilmBookingStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await repository.updateFilmBookingStatus(id, status);

    res.status(200).json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (err) {
    next(err);
  }
}

async function exportFilmBookings(req, res, next) {
  try {
    const bookings = await repository.getAllFilmBookings();

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    const csv = exportFilmBookingsToCSV(bookings);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=film-bookings.csv");
    res.status(200).send(csv);
  } catch (err) {
    next(err);
  }
}

// ==================
// Film Inquiries
// ==================

async function createFilmInquiry(req, res, next) {
  try {
    const validatedData = await filmInquirySchema.validateAsync(req.body);
    const inquiry = await repository.createFilmInquiry(validatedData);

    // Send notification to admin
    const filmTitle = validatedData.filmId
      ? (await repository.getFilmById(validatedData.filmId))?.title
      : "General Inquiry";

    await sendFilmInquiryNotification({
      ...validatedData,
      filmTitle,
    });

    res.status(201).json({
      message: "Inquiry submitted successfully",
      inquiry,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllFilmInquiries(req, res, next) {
  try {
    const inquiries = await repository.getAllFilmInquiries();

    res.status(200).json({
      message: "Film inquiries retrieved successfully",
      data: inquiries,
    });
  } catch (err) {
    next(err);
  }
}

async function updateFilmInquiryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const inquiry = await repository.updateFilmInquiryStatus(id, status, adminResponse);

    res.status(200).json({
      message: "Inquiry updated successfully",
      inquiry,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createFilm,
  updateFilm,
  deleteFilm,
  getAllFilms,
  getFilmById,
  getFeaturedFilms,
  createScreeningSlot,
  getScreeningSlotsByFilm,
  updateScreeningSlot,
  deleteScreeningSlot,
  bookFilmScreening,
  confirmFilmPayment,
  getAllFilmBookings,
  getUserFilmBookings,
  updateFilmBookingStatus,
  exportFilmBookings,
  createFilmInquiry,
  getAllFilmInquiries,
  updateFilmInquiryStatus,
};
