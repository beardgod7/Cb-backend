/**
 * Registers booking handlers for the existing payable feature types so the
 * Payment module can price them server-side and run their paid step.
 *
 * Merchandise and Bookstore register their own handlers from within their
 * modules (they own richer paid-step logic). Keeping tour/trip/film here avoids
 * editing each Travels/Films controller just for the registry wiring.
 */
const { registerBookingHandler } = require("./bookingRegistry");

const { TourBooking } = require("../Travels/Tours/model");
const { TripBooking } = require("../Travels/Trips/model");
const { FilmBooking, ScreeningSlot } = require("../Films/model");

function bookingSummary(title, lines, email) {
  return { title, lines, email };
}

// ----- Tours -----
registerBookingHandler("tour", {
  async getBooking(id) {
    const b = await TourBooking.findByPk(id);
    if (!b) return null;
    return {
      id: b.id,
      userId: b.userId,
      email: b.email,
      total: Number(b.totalAmount),
      status: b.paymentStatus,
      alreadyPaid: b.paymentStatus === "success",
      summary: bookingSummary(
        `Tour booking ${b.ticketId || b.id}`,
        [`${b.numberOfTickets} ticket(s) for ${b.selectedDate}`],
        b.email
      ),
    };
  },
  async markPaid(id) {
    const b = await TourBooking.findByPk(id);
    if (!b || b.paymentStatus === "success") return;
    b.paymentStatus = "success";
    b.bookingStatus = "confirmed";
    await b.save();
  },
});

// ----- Trips -----
registerBookingHandler("trip", {
  async getBooking(id) {
    const b = await TripBooking.findByPk(id);
    if (!b) return null;
    return {
      id: b.id,
      userId: b.userId,
      email: b.email,
      total: Number(b.totalAmount),
      status: b.paymentStatus,
      alreadyPaid: b.paymentStatus === "success",
      summary: bookingSummary(
        `Trip booking ${b.ticketId || b.id}`,
        [`${b.numberOfTickets} spot(s)`],
        b.email
      ),
    };
  },
  async markPaid(id) {
    const b = await TripBooking.findByPk(id);
    if (!b || b.paymentStatus === "success") return;
    b.paymentStatus = "success";
    b.bookingStatus = "confirmed";
    await b.save();
  },
});

// ----- Films -----
registerBookingHandler("film", {
  async getBooking(id) {
    const b = await FilmBooking.findByPk(id);
    if (!b) return null;
    return {
      id: b.id,
      userId: b.userId,
      email: b.email,
      total: Number(b.totalAmount),
      status: b.paymentStatus,
      alreadyPaid: b.paymentStatus === "success",
      summary: bookingSummary(
        `Film ticket ${b.ticketId || b.id}`,
        [`${b.numberOfSeats} seat(s)`],
        b.email
      ),
    };
  },
  async markPaid(id) {
    const b = await FilmBooking.findByPk(id);
    if (!b || b.paymentStatus === "success") return;
    b.paymentStatus = "success";
    b.bookingStatus = "confirmed";
    await b.save();
    // Confirm the held seats.
    const slot = await ScreeningSlot.findByPk(b.screeningSlotId);
    if (slot) {
      slot.bookedSeats = (slot.bookedSeats || 0) + b.numberOfSeats;
      await slot.save();
    }
  },
});

module.exports = {};
