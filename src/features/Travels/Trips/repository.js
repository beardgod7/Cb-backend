const { Trip, TripBooking, TripInquiry } = require("./model");
const { Op } = require("sequelize");

// Trips
async function createTrip(tripData) {
  return await Trip.create(tripData);
}

async function getAllTrips(filter = {}) {
  const where = { isActive: true };
  
  if (filter.destinationType) {
    where.destinationType = filter.destinationType;
  }
  
  if (filter.upcoming) {
    where.startDate = { [Op.gte]: new Date() };
  }

  return await Trip.findAll({
    where,
    order: [["startDate", "ASC"]],
  });
}

async function getTripById(id) {
  return await Trip.findByPk(id);
}

async function updateTrip(id, updateData) {
  const trip = await Trip.findByPk(id);
  if (!trip) throw new Error("Trip not found");
  return await trip.update(updateData);
}

async function deleteTrip(id) {
  const trip = await Trip.findByPk(id);
  if (!trip) throw new Error("Trip not found");
  await trip.destroy();
  return true;
}

async function incrementTripBookings(tripId, count) {
  const trip = await Trip.findByPk(tripId);
  if (!trip) throw new Error("Trip not found");
  return await trip.update({
    currentBookings: trip.currentBookings + count,
  });
}

// Trip Bookings
async function createTripBooking(bookingData) {
  return await TripBooking.create(bookingData);
}

async function getAllTripBookings() {
  return await TripBooking.findAll({
    order: [["createdAt", "DESC"]],
  });
}

async function getTripBookingById(id) {
  return await TripBooking.findByPk(id);
}

async function getTripBookingsByTripId(tripId) {
  return await TripBooking.findAll({
    where: { tripId },
    order: [["createdAt", "DESC"]],
  });
}

async function updateTripBookingStatus(id, status) {
  const booking = await TripBooking.findByPk(id);
  if (!booking) throw new Error("Booking not found");
  return await booking.update({ bookingStatus: status });
}

async function updateTripBookingPayment(id, paymentStatus, paymentId, ticketId, qrCode) {
  const booking = await TripBooking.findByPk(id);
  if (!booking) throw new Error("Booking not found");
  return await booking.update({
    paymentStatus,
    paymentId,
    ticketId,
    qrCode,
    bookingStatus: paymentStatus === "success" ? "confirmed" : "pending",
  });
}

// Trip Inquiries
async function createTripInquiry(inquiryData) {
  return await TripInquiry.create(inquiryData);
}

async function getAllTripInquiries() {
  return await TripInquiry.findAll({
    order: [["createdAt", "DESC"]],
  });
}

async function getTripInquiryById(id) {
  return await TripInquiry.findByPk(id);
}

async function updateTripInquiryStatus(id, status, adminResponse = null) {
  const inquiry = await TripInquiry.findByPk(id);
  if (!inquiry) throw new Error("Inquiry not found");
  return await inquiry.update({ status, adminResponse });
}

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  incrementTripBookings,
  createTripBooking,
  getAllTripBookings,
  getTripBookingById,
  getTripBookingsByTripId,
  updateTripBookingStatus,
  updateTripBookingPayment,
  createTripInquiry,
  getAllTripInquiries,
  getTripInquiryById,
  updateTripInquiryStatus,
};
