const { Tour, TourBooking, TourInquiry } = require("./model");
const { Op } = require("sequelize");

// Tours
async function createTour(tourData) {
  return await Tour.create(tourData);
}

async function getAllTours() {
  return await Tour.findAll({
    where: { isActive: true },
    order: [["createdAt", "DESC"]],
  });
}

async function getTourById(id) {
  return await Tour.findByPk(id);
}

async function updateTour(id, updateData) {
  const tour = await Tour.findByPk(id);
  if (!tour) throw new Error("Tour not found");
  return await tour.update(updateData);
}

async function deleteTour(id) {
  const tour = await Tour.findByPk(id);
  if (!tour) throw new Error("Tour not found");
  await tour.destroy();
  return true;
}

// Tour Bookings
async function createTourBooking(bookingData) {
  return await TourBooking.create(bookingData);
}

async function getAllTourBookings() {
  return await TourBooking.findAll({
    order: [["createdAt", "DESC"]],
  });
}

async function getTourBookingById(id) {
  return await TourBooking.findByPk(id);
}

async function getTourBookingsByTourId(tourId) {
  return await TourBooking.findAll({
    where: { tourId },
    order: [["selectedDate", "ASC"]],
  });
}

async function getTourBookingsByDate(tourId, date) {
  return await TourBooking.findAll({
    where: { tourId, selectedDate: date },
  });
}

async function updateTourBookingStatus(id, status) {
  const booking = await TourBooking.findByPk(id);
  if (!booking) throw new Error("Booking not found");
  return await booking.update({ bookingStatus: status });
}

async function updateTourBookingPayment(id, paymentStatus, paymentId, ticketId, qrCode) {
  const booking = await TourBooking.findByPk(id);
  if (!booking) throw new Error("Booking not found");
  return await booking.update({
    paymentStatus,
    paymentId,
    ticketId,
    qrCode,
    bookingStatus: paymentStatus === "success" ? "confirmed" : "pending",
  });
}

// Tour Inquiries
async function createTourInquiry(inquiryData) {
  return await TourInquiry.create(inquiryData);
}

async function getAllTourInquiries() {
  return await TourInquiry.findAll({
    order: [["createdAt", "DESC"]],
  });
}

async function getTourInquiryById(id) {
  return await TourInquiry.findByPk(id);
}

async function updateTourInquiryStatus(id, status, adminResponse = null) {
  const inquiry = await TourInquiry.findByPk(id);
  if (!inquiry) throw new Error("Inquiry not found");
  return await inquiry.update({ status, adminResponse });
}

module.exports = {
  createTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  createTourBooking,
  getAllTourBookings,
  getTourBookingById,
  getTourBookingsByTourId,
  getTourBookingsByDate,
  updateTourBookingStatus,
  updateTourBookingPayment,
  createTourInquiry,
  getAllTourInquiries,
  getTourInquiryById,
  updateTourInquiryStatus,
};
