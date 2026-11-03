/**
 * Cross-cutting Travels endpoints that span both Tours and Trips:
 *   GET /travels/bookings/me  — the logged-in user's tour + trip bookings.
 */
const { TourBooking, Tour } = require("./Tours/model");
const { TripBooking, Trip } = require("./Trips/model");
const { ok } = require("../../utils/apiResponse");

async function myBookings(req, res, next) {
  try {
    const [tourBookings, tripBookings] = await Promise.all([
      TourBooking.findAll({ where: { userId: req.userId }, order: [["createdAt", "DESC"]] }),
      TripBooking.findAll({ where: { userId: req.userId }, order: [["createdAt", "DESC"]] }),
    ]);

    const tours = await Promise.all(
      tourBookings.map(async (b) => {
        const tour = await Tour.findByPk(b.tourId);
        return {
          type: "tour",
          id: b.id,
          title: tour ? tour.title : null,
          selectedDate: b.selectedDate,
          numberOfTickets: b.numberOfTickets,
          totalAmount: Number(b.totalAmount),
          paymentStatus: b.paymentStatus,
          bookingStatus: b.bookingStatus,
          ticketId: b.ticketId,
          createdAt: b.createdAt,
        };
      })
    );

    const trips = await Promise.all(
      tripBookings.map(async (b) => {
        const trip = await Trip.findByPk(b.tripId);
        return {
          type: "trip",
          id: b.id,
          title: trip ? trip.title : null,
          numberOfTickets: b.numberOfTickets,
          totalAmount: Number(b.totalAmount),
          paymentStatus: b.paymentStatus,
          bookingStatus: b.bookingStatus,
          ticketId: b.ticketId,
          createdAt: b.createdAt,
        };
      })
    );

    const all = [...tours, ...trips].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return ok(res, { message: "Your travel bookings", data: all });
  } catch (err) {
    next(err);
  }
}

module.exports = { myBookings };
