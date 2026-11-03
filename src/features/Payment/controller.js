const crypto = require("crypto");
const { getPaymentService } = require("./paymentService");
const repository = require("./repository");
const { getBookingHandler, VALID_BOOKING_TYPES } = require("./bookingRegistry");
const { ok, AppError } = require("../../utils/apiResponse");
const { sendMail } = require("../../service/emailservice");

const SITE_DOMAINS = (process.env.SITE_URL || "https://cbaac.gov.ng")
  .split(",")
  .map((d) => d.trim())
  .filter(Boolean);

function defaultCallback(bookingType) {
  const base = SITE_DOMAINS[0] || "https://cbaac.gov.ng";
  const map = {
    merchandise: "/checkout/complete",
    bookstore: "/bookstore/complete",
    tour: "/travels/complete",
    trip: "/travels/complete",
    film: "/films/complete",
    event: "/events/complete",
  };
  return `${base}${map[bookingType] || "/payment/complete"}`;
}

function isAllowedCallback(url) {
  if (!url) return false;
  try {
    const u = new URL(url);
    return SITE_DOMAINS.some((d) => {
      try {
        return new URL(d).host === u.host;
      } catch {
        return url.startsWith(d);
      }
    });
  } catch {
    return false;
  }
}

function buildReference(bookingType, bookingId) {
  const shortId = String(bookingId).replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase();
  return `CBAAC-${bookingType.toUpperCase().slice(0, 4)}-${shortId}-${Date.now()}`;
}

// ===== Initialize =====
exports.initializePayment = async (req, res, next) => {
  try {
    const { bookingType, bookingId, email, gateway = "paystack", callbackUrl } = req.body;

    if (!bookingType || !bookingId) {
      throw new AppError("BAD_REQUEST", "bookingType and bookingId are required", 400);
    }
    if (!VALID_BOOKING_TYPES.includes(bookingType)) {
      throw new AppError("INVALID_BOOKING_TYPE", "Unknown booking type", 400);
    }

    const handler = getBookingHandler(bookingType);
    if (!handler) {
      throw new AppError("INVALID_BOOKING_TYPE", "This booking type cannot be paid yet", 400);
    }

    const booking = await handler.getBooking(bookingId);
    if (!booking) {
      throw new AppError("BOOKING_NOT_FOUND", "No booking/order with that id", 404);
    }

    // Ownership: the booking must belong to the logged-in user (when we know the user).
    if (req.userId && booking.userId && String(booking.userId) !== String(req.userId)) {
      throw new AppError("BOOKING_NOT_FOUND", "No booking/order with that id for this user", 404);
    }
    if (booking.alreadyPaid) {
      throw new AppError("ALREADY_PAID", "This booking/order is already paid", 409);
    }

    // Amount is read from the booking (server-side), never from the client.
    const amount = Number(booking.total);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new AppError("BAD_REQUEST", "Booking total is invalid", 400);
    }

    // Validate callbackUrl against the site's own domain.
    let finalCallback = defaultCallback(bookingType);
    if (callbackUrl) {
      if (!isAllowedCallback(callbackUrl)) {
        throw new AppError("INVALID_CALLBACK_URL", "callbackUrl must be on the site's domain", 400);
      }
      finalCallback = callbackUrl;
    }

    const buyerEmail = email || booking.email;
    const reference = buildReference(bookingType, bookingId);

    await repository.createPayment({
      transactionReference: reference,
      paymentGateway: gateway,
      amount,
      bookingType,
      bookingId: String(bookingId),
      userId: booking.userId || req.userId || null,
      email: buyerEmail,
      status: "pending",
      metadata: { callbackUrl: finalCallback },
    });

    const service = getPaymentService(gateway);
    const result = await service.initializePayment(buyerEmail, amount, reference, {
      bookingType,
      bookingId,
      callback_url: finalCallback,
    });

    if (!result.success) {
      throw new AppError("INITIALIZATION_FAILED", result.message || "Payment initialization failed", 400);
    }

    return ok(res, {
      message: "Payment initialized successfully",
      data: {
        authorization_url: result.authorizationUrl,
        reference,
        amount, // naira
        currency: "NGN",
      },
    });
  } catch (error) {
    next(error);
  }
};

// ===== Verify =====
exports.verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;
    const payment = await repository.getPaymentByReference(reference);
    if (!payment) throw new AppError("BOOKING_NOT_FOUND", "Payment not found", 404);

    // Always re-check with the gateway so a closed tab still gets marked paid.
    const service = getPaymentService(payment.paymentGateway);
    const result = await service.verifyPayment(reference);

    let summary = null;
    const handler = getBookingHandler(payment.bookingType);

    if (result.success) {
      if (payment.status !== "success") {
        await repository.updatePaymentStatus(reference, "success", { gateway: result.data });
        if (handler) {
          await handler.markPaid(payment.bookingId, {
            reference,
            paidAt: new Date(),
          });
        }
      }
      if (handler) {
        const booking = await handler.getBooking(payment.bookingId);
        if (booking && booking.summary) summary = booking.summary;
      }
      return ok(res, {
        message: "Payment verified successfully",
        data: {
          reference,
          status: "success",
          amount: Number(payment.amount),
          currency: payment.currency,
          bookingType: payment.bookingType,
          bookingId: payment.bookingId,
          paidAt: payment.paidAt || new Date().toISOString(),
          summary,
        },
      });
    }

    await repository.updatePaymentStatus(reference, "failed", { gateway: result.data });
    return ok(res, {
      message: "Payment not successful",
      data: { reference, status: "failed", bookingType: payment.bookingType, bookingId: payment.bookingId },
    });
  } catch (error) {
    next(error);
  }
};

// ===== History =====
exports.getPaymentHistoryMe = async (req, res, next) => {
  try {
    const payments = await repository.getPaymentsByUser(req.userId);
    return ok(res, { message: "Payment history retrieved successfully", data: payments });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await repository.getPaymentsByUser(req.params.userId);
    return ok(res, { message: "Payment history retrieved successfully", data: payments });
  } catch (error) {
    next(error);
  }
};

exports.getAllTransactions = async (req, res, next) => {
  try {
    const payments = await repository.getAllPayments();
    return ok(res, { message: "Transactions retrieved successfully", data: payments });
  } catch (error) {
    next(error);
  }
};

exports.getPaymentStatistics = async (req, res, next) => {
  try {
    const stats = await repository.getPaymentStats();
    return ok(res, { message: "Payment statistics retrieved successfully", data: stats });
  } catch (error) {
    next(error);
  }
};

// ===== Shared paid-step runner for webhooks =====
async function runPaidStep(reference, gatewayData) {
  const payment = await repository.getPaymentByReference(reference);
  if (!payment) return; // unknown reference
  if (payment.status === "success") return; // idempotent: Paystack retries

  // Amount check: paid amount (kobo) must equal the record total (naira * 100).
  if (gatewayData && typeof gatewayData.amount === "number") {
    const expectedKobo = Math.round(Number(payment.amount) * 100);
    if (gatewayData.amount !== expectedKobo) {
      console.warn(`Amount mismatch for ${reference}: paid ${gatewayData.amount}, expected ${expectedKobo}`);
      return;
    }
  }

  await repository.updatePaymentStatus(reference, "success", { gateway: gatewayData });

  const handler = getBookingHandler(payment.bookingType);
  if (handler) {
    try {
      await handler.markPaid(payment.bookingId, { reference, paidAt: new Date() });
    } catch (e) {
      console.error("Paid-step error:", e.message);
    }
  }

  // Confirmation email.
  try {
    let lines = [];
    let title = `${payment.bookingType} payment`;
    if (handler) {
      const booking = await handler.getBooking(payment.bookingId);
      if (booking && booking.summary) {
        title = booking.summary.title || title;
        lines = booking.summary.lines || [];
      }
    }
    await sendMail({
      to: payment.email,
      subject: "Your CBAAC payment was successful",
      html: `
        <p>Thank you. Your payment was successful.</p>
        <p><strong>${title}</strong></p>
        ${lines.length ? `<ul>${lines.map((l) => `<li>${l}</li>`).join("")}</ul>` : ""}
        <p>Amount: ₦${Number(payment.amount).toLocaleString()}</p>
        <p>Reference: ${reference}</p>
      `,
    });
  } catch (e) {
    console.error("Confirmation email failed:", e.message);
  }
}

// ===== Webhooks =====
exports.paystackWebhook = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const signature = req.headers["x-paystack-signature"];
    // Verify signature against the raw body; ignore anything unsigned.
    if (secret && signature) {
      const hash = crypto
        .createHmac("sha512", secret)
        .update(JSON.stringify(req.body))
        .digest("hex");
      if (hash !== signature) {
        console.warn("Paystack webhook signature mismatch");
        return res.status(401).send("Invalid signature");
      }
    } else if (secret) {
      return res.status(401).send("Missing signature");
    }

    const event = req.body;
    if (event.event === "charge.success") {
      await runPaidStep(event.data.reference, event.data);
    }
    return res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return res.status(200).send("ok");
  }
};

exports.flutterwaveWebhook = async (req, res) => {
  try {
    const event = req.body;
    if (event.event === "charge.completed" && event.data?.status === "successful") {
      await runPaidStep(event.data.tx_ref, { amount: Math.round((event.data.amount || 0) * 100) });
    }
    return res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Flutterwave webhook error:", error);
    return res.status(200).send("ok");
  }
};

exports.stripeWebhook = async (req, res) => {
  try {
    const event = req.body;
    if (event.type === "checkout.session.completed") {
      await runPaidStep(event.data.object.client_reference_id, {});
    }
    return res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return res.status(200).send("ok");
  }
};

// ===== Bank transfer =====
exports.getBankDetails = async (req, res, next) => {
  try {
    const s = await repository.getPaymentSettings();
    return ok(res, {
      message: "Bank details",
      data: { accountName: s.accountName, bankName: s.bankName, accountNumber: s.accountNumber },
    });
  } catch (error) {
    next(error);
  }
};

exports.createTransferNotice = async (req, res, next) => {
  try {
    const { bookingType, bookingId, senderBank, senderName, proofUrl } = req.body;
    if (!bookingType || !bookingId) {
      throw new AppError("BAD_REQUEST", "bookingType and bookingId are required", 400);
    }
    const handler = getBookingHandler(bookingType);
    if (!handler) throw new AppError("INVALID_BOOKING_TYPE", "Unknown booking type", 400);

    const booking = await handler.getBooking(bookingId);
    if (!booking) throw new AppError("BOOKING_NOT_FOUND", "No booking/order with that id", 404);
    if (req.userId && booking.userId && String(booking.userId) !== String(req.userId)) {
      throw new AppError("BOOKING_NOT_FOUND", "No booking/order with that id for this user", 404);
    }
    if (booking.alreadyPaid) throw new AppError("ALREADY_PAID", "Already paid", 409);

    const notice = await repository.createTransferNotice({
      userId: req.userId,
      bookingType,
      bookingId: String(bookingId),
      amount: Number(booking.total),
      senderBank,
      senderName,
      proofUrl,
      status: "pending",
    });

    // Move order/booking to awaiting_transfer if the handler supports it.
    if (handler.awaitTransfer) {
      try { await handler.awaitTransfer(bookingId); } catch (_) {}
    }

    return ok(res, { status: 201, message: "Transfer notice submitted", data: { id: notice.id, status: "pending" } });
  } catch (error) {
    next(error);
  }
};

exports.getMyTransferNotices = async (req, res, next) => {
  try {
    const notices = await repository.getTransferNoticesByUser(req.userId);
    return ok(res, { message: "Your transfer notices", data: notices });
  } catch (error) {
    next(error);
  }
};

exports.listTransferNotices = async (req, res, next) => {
  try {
    const notices = await repository.listTransferNotices(req.query.status);
    return ok(res, { message: "Transfer notices", data: notices });
  } catch (error) {
    next(error);
  }
};

exports.reviewTransferNotice = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    if (!["confirmed", "rejected"].includes(status)) {
      throw new AppError("BAD_REQUEST", "status must be confirmed or rejected", 400);
    }
    const notice = await repository.getTransferNoticeById(req.params.id);
    if (!notice) throw new AppError("NOT_FOUND", "Transfer notice not found", 404);

    notice.status = status;
    notice.adminNote = adminNote || null;
    notice.reviewedAt = new Date();
    notice.reviewedBy = req.userId || (req.user && req.user.sub) || null;
    await notice.save();

    if (status === "confirmed") {
      // Run the same paid path as a card payment.
      const handler = getBookingHandler(notice.bookingType);
      if (handler) {
        await handler.markPaid(notice.bookingId, { reference: `TRANSFER-${notice.id}`, paidAt: new Date() });
        try {
          const booking = await handler.getBooking(notice.bookingId);
          await sendMail({
            to: booking?.email,
            subject: "Your CBAAC bank transfer was confirmed",
            html: `<p>Your transfer has been confirmed and your ${notice.bookingType} is now paid.</p>`,
          });
        } catch (_) {}
      }
    }

    return ok(res, { message: `Transfer ${status}`, data: notice });
  } catch (error) {
    next(error);
  }
};
