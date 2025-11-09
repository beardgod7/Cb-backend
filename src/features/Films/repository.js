const { Film, ScreeningSlot, FilmBooking, FilmInquiry } = require("./model");
const { Op } = require("sequelize");

// ==================
// Films
// ==================

async function createFilm(filmData) {
  return await Film.create(filmData);
}

async function getAllFilms(filter = {}) {
  const where = { isActive: true };

  if (filter.category) {
    where.category = filter.category;
  }

  if (filter.country) {
    where.country = filter.country;
  }

  if (filter.festivalYear) {
    where.festivalYear = filter.festivalYear;
  }

  if (filter.featured) {
    where.isFeatured = true;
  }

  if (filter.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${filter.search}%` } },
      { category: { [Op.iLike]: `%${filter.search}%` } },
      { tags: { [Op.contains]: [filter.search] } },
    ];
  }

  return await Film.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });
}

async function getFilmById(id) {
  return await Film.findByPk(id);
}

async function updateFilm(id, updateData) {
  const film = await Film.findByPk(id);
  if (!film) throw new Error("Film not found");
  return await film.update(updateData);
}

async function deleteFilm(id) {
  const film = await Film.findByPk(id);
  if (!film) throw new Error("Film not found");
  await film.destroy();
  return true;
}

async function getFeaturedFilms() {
  return await Film.findAll({
    where: { isActive: true, isFeatured: true },
    limit: 10,
  });
}

// ==================
// Screening Slots
// ==================

async function createScreeningSlot(slotData) {
  return await ScreeningSlot.create(slotData);
}

async function getScreeningSlotsByFilm(filmId) {
  return await ScreeningSlot.findAll({
    where: {
      filmId,
      isAvailable: true,
      screeningDate: { [Op.gte]: new Date() },
    },
    order: [["screeningDate", "ASC"], ["startTime", "ASC"]],
  });
}

async function getScreeningSlotById(id) {
  return await ScreeningSlot.findByPk(id, {
    include: [
      {
        model: Film,
        attributes: ["id", "title", "ticketPrice", "duration"],
      },
    ],
  });
}

async function updateScreeningSlot(id, updateData) {
  const slot = await ScreeningSlot.findByPk(id);
  if (!slot) throw new Error("Screening slot not found");
  return await slot.update(updateData);
}

async function deleteScreeningSlot(id) {
  const slot = await ScreeningSlot.findByPk(id);
  if (!slot) throw new Error("Screening slot not found");
  await slot.destroy();
  return true;
}

async function incrementBookedSeats(slotId, numberOfSeats) {
  const slot = await ScreeningSlot.findByPk(slotId);
  if (!slot) throw new Error("Screening slot not found");
  
  const newBookedSeats = slot.bookedSeats + numberOfSeats;
  
  return await slot.update({
    bookedSeats: newBookedSeats,
    isAvailable: newBookedSeats < slot.maxSeats,
  });
}

// ==================
// Film Bookings
// ==================

async function createFilmBooking(bookingData) {
  return await FilmBooking.create(bookingData);
}

async function getAllFilmBookings() {
  return await FilmBooking.findAll({
    include: [
      {
        model: Film,
        attributes: ["id", "title", "coverImage"],
      },
      {
        model: ScreeningSlot,
        attributes: ["screeningDate", "startTime"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
}

async function getFilmBookingById(id) {
  return await FilmBooking.findByPk(id, {
    include: [
      {
        model: Film,
        attributes: ["id", "title", "coverImage", "duration"],
      },
      {
        model: ScreeningSlot,
        attributes: ["screeningDate", "startTime", "endTime"],
      },
    ],
  });
}

async function getFilmBookingsByUser(userId) {
  return await FilmBooking.findAll({
    where: { userId },
    include: [
      {
        model: Film,
        attributes: ["id", "title", "coverImage"],
      },
      {
        model: ScreeningSlot,
        attributes: ["screeningDate", "startTime"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
}

async function updateFilmBookingPayment(id, paymentStatus, paymentId, ticketId, qrCode) {
  const booking = await FilmBooking.findByPk(id);
  if (!booking) throw new Error("Booking not found");
  
  return await booking.update({
    paymentStatus,
    paymentId,
    ticketId,
    qrCode,
    bookingStatus: paymentStatus === "success" ? "confirmed" : "pending",
  });
}

async function updateFilmBookingStatus(id, status) {
  const booking = await FilmBooking.findByPk(id);
  if (!booking) throw new Error("Booking not found");
  return await booking.update({ bookingStatus: status });
}

async function getUpcomingBookingsForReminders() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  return await FilmBooking.findAll({
    where: {
      paymentStatus: "success",
      bookingStatus: "confirmed",
      reminderSent: false,
    },
    include: [
      {
        model: Film,
        attributes: ["id", "title"],
      },
      {
        model: ScreeningSlot,
        where: {
          screeningDate: {
            [Op.gte]: tomorrow,
            [Op.lt]: dayAfterTomorrow,
          },
        },
        attributes: ["screeningDate", "startTime"],
      },
    ],
  });
}

async function markReminderSent(bookingId) {
  const booking = await FilmBooking.findByPk(bookingId);
  if (!booking) throw new Error("Booking not found");
  return await booking.update({ reminderSent: true });
}

// ==================
// Film Inquiries
// ==================

async function createFilmInquiry(inquiryData) {
  return await FilmInquiry.create(inquiryData);
}

async function getAllFilmInquiries() {
  return await FilmInquiry.findAll({
    include: [
      {
        model: Film,
        attributes: ["id", "title"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });
}

async function getFilmInquiryById(id) {
  return await FilmInquiry.findByPk(id, {
    include: [
      {
        model: Film,
        attributes: ["id", "title"],
      },
    ],
  });
}

async function updateFilmInquiryStatus(id, status, adminResponse = null) {
  const inquiry = await FilmInquiry.findByPk(id);
  if (!inquiry) throw new Error("Inquiry not found");
  return await inquiry.update({ status, adminResponse });
}

module.exports = {
  createFilm,
  getAllFilms,
  getFilmById,
  updateFilm,
  deleteFilm,
  getFeaturedFilms,
  createScreeningSlot,
  getScreeningSlotsByFilm,
  getScreeningSlotById,
  updateScreeningSlot,
  deleteScreeningSlot,
  incrementBookedSeats,
  createFilmBooking,
  getAllFilmBookings,
  getFilmBookingById,
  getFilmBookingsByUser,
  updateFilmBookingPayment,
  updateFilmBookingStatus,
  getUpcomingBookingsForReminders,
  markReminderSent,
  createFilmInquiry,
  getAllFilmInquiries,
  getFilmInquiryById,
  updateFilmInquiryStatus,
};
