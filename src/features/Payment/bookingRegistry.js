/**
 * Booking registry — bridges Payments and the feature modules.
 *
 * Each feature registers a handler keyed by bookingType. Payments uses it to:
 *   - read the server-side total + email + summary for a booking (initialize/verify)
 *   - run the "paid step" (reduce stock, issue tickets, create download) on success
 *
 * Features call registerBookingHandler(type, handler) when their module loads.
 * This avoids circular requires between Payments and every feature.
 *
 * handler shape:
 * {
 *   async getBooking(bookingId): {
 *     id, userId, email, total (naira), status, alreadyPaid (bool),
 *     summary: { title, lines: string[], email }
 *   } | null
 *   async markPaid(bookingId, { reference, paidAt }): void   // idempotent
 *   async release?(bookingId): void                          // optional: free held stock/seats
 * }
 */

const handlers = new Map();

function registerBookingHandler(type, handler) {
  handlers.set(type, handler);
}

function getBookingHandler(type) {
  return handlers.get(type) || null;
}

const VALID_BOOKING_TYPES = [
  "event",
  "tour",
  "trip",
  "film",
  "library",
  "merchandise",
  "bookstore",
  "museum",
];

module.exports = {
  registerBookingHandler,
  getBookingHandler,
  VALID_BOOKING_TYPES,
};
