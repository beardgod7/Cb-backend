/**
 * Bookstore purchase payment handler. Registered with the Payment booking
 * registry so POST /payment/initialize { bookingType: "bookstore" } works and
 * the webhook marks the purchase paid + the buyer can download.
 */
const { registerBookingHandler } = require("../Payment/bookingRegistry");
const { sendMail } = require("../../service/emailservice");
const { BookPurchase, BookstoreBook } = require("./model");
const { findUserById } = require("../Authentication/repository");

const SITE_URL = process.env.SITE_URL || "https://cbaac.gov.ng";

registerBookingHandler("bookstore", {
  async getBooking(purchaseId) {
    const purchase = await BookPurchase.findByPk(purchaseId);
    if (!purchase) return null;
    let email;
    try {
      const user = await findUserById(purchase.userId);
      email = user && user.email;
    } catch (_) {}
    return {
      id: purchase.id,
      userId: purchase.userId,
      email,
      total: Number(purchase.price),
      status: purchase.status,
      alreadyPaid: purchase.status === "paid",
      summary: {
        title: purchase.title || "Book purchase",
        lines: [purchase.title || "Book"],
        email,
      },
    };
  },

  async awaitTransfer(purchaseId) {
    const purchase = await BookPurchase.findByPk(purchaseId);
    if (purchase && purchase.status === "pending_payment") {
      purchase.status = "awaiting_transfer";
      await purchase.save();
    }
  },

  async markPaid(purchaseId, { reference } = {}) {
    const purchase = await BookPurchase.findByPk(purchaseId);
    if (!purchase || purchase.status === "paid") return;
    purchase.status = "paid";
    purchase.paidAt = new Date();
    if (reference) purchase.paymentReference = reference;
    await purchase.save();

    // Email a download link (through the site, which logs in then downloads).
    try {
      const user = await findUserById(purchase.userId);
      if (user && user.email) {
        const link = `${SITE_URL}/bookstore/library?purchase=${purchase.id}`;
        await sendMail({
          to: user.email,
          subject: "Your CBAAC book purchase",
          html: `<p>Your payment was successful and a copy of <strong>${purchase.title}</strong> has been sent to your email.</p>
                 <p><a href="${link}">Download your book</a></p>`,
        });
      }
    } catch (_) {}
  },
});

module.exports = {};
