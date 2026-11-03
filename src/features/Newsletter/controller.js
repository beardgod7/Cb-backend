const crypto = require("crypto");
const repository = require("./repository");
const { subscribeSchema } = require("./schema");
const { ok, fail, AppError } = require("../../utils/apiResponse");
const { getPagination, buildListResponse } = require("../../utils/pagination");
const { sendMail } = require("../../service/emailservice");

const SITE_URL = process.env.SITE_URL || "https://cbaac.gov.ng";
const API_BASE =
  process.env.API_BASE_URL || "https://cb-backend-qwxd.onrender.com/v1/api";

function token() {
  return crypto.randomBytes(24).toString("hex");
}

async function subscribe(req, res, next) {
  try {
    const data = await subscribeSchema.validateAsync(req.body);

    // Honeypot tripped -> pretend success, store nothing.
    if (data.website) {
      return ok(res, { status: 201, message: "Subscribed", data: { pending: true } });
    }

    const existing = await repository.findByEmail(data.email);
    if (existing) {
      if (existing.status === "active") {
        // Don't reveal it as an error.
        return ok(res, {
          status: 200,
          message: "You're already subscribed.",
          data: { alreadySubscribed: true },
        });
      }
      // pending or previously unsubscribed -> resend confirm.
      existing.status = "pending";
      existing.confirmToken = existing.confirmToken || token();
      existing.unsubscribeToken = existing.unsubscribeToken || token();
      await existing.save();
      await sendConfirmEmail(existing);
      return ok(res, {
        status: 201,
        message: "Please check your email to confirm your subscription.",
        data: { pending: true },
      });
    }

    const sub = await repository.create({
      email: data.email,
      source: data.source || null,
      status: "pending",
      confirmToken: token(),
      unsubscribeToken: token(),
    });
    await sendConfirmEmail(sub);

    return ok(res, {
      status: 201,
      message: "Please check your email to confirm your subscription.",
      data: { pending: true },
    });
  } catch (err) {
    next(err);
  }
}

async function sendConfirmEmail(sub) {
  const confirmUrl = `${API_BASE}/newsletter/confirm?token=${sub.confirmToken}`;
  await sendMail({
    to: sub.email,
    subject: "Confirm your CBAAC newsletter subscription",
    html: `
      <p>Thanks for subscribing to the CBAAC monthly newsletter.</p>
      <p>Please confirm your subscription by clicking the link below:</p>
      <p><a href="${confirmUrl}">Confirm subscription</a></p>
      <p>If you didn't request this, you can ignore this email.</p>
    `,
  });
}

async function confirm(req, res, next) {
  try {
    const { token: t } = req.query;
    if (!t) throw new AppError("INVALID_TOKEN", "Confirmation token is required", 400);

    const sub = await repository.findByConfirmToken(t);
    if (!sub) throw new AppError("INVALID_TOKEN", "Invalid or expired confirmation link", 400);

    if (sub.status !== "active") {
      sub.status = "active";
      sub.confirmedAt = new Date();
      sub.confirmToken = null;
      await sub.save();
    }

    // Redirect to a thank-you page on the site.
    return res.redirect(`${SITE_URL}/newsletter/thank-you`);
  } catch (err) {
    next(err);
  }
}

async function unsubscribe(req, res, next) {
  try {
    const { token: t } = req.query;
    if (!t) throw new AppError("INVALID_TOKEN", "Unsubscribe token is required", 400);

    const sub = await repository.findByUnsubscribeToken(t);
    if (sub && sub.status !== "unsubscribed") {
      sub.status = "unsubscribed";
      sub.unsubscribedAt = new Date();
      await sub.save();
    }
    return res.redirect(`${SITE_URL}/newsletter/unsubscribed`);
  } catch (err) {
    next(err);
  }
}

// ===== Admin =====

async function listSubscribers(req, res, next) {
  try {
    const { page, limit, offset } = getPagination(req.query, { defaultLimit: 50 });
    const { rows, count } = await repository.listSubscribers({
      status: req.query.status,
      offset,
      limit,
    });
    return ok(res, {
      message: "Subscribers retrieved successfully",
      data: buildListResponse(rows, count, page, limit),
    });
  } catch (err) {
    next(err);
  }
}

async function exportSubscribers(req, res, next) {
  try {
    const subs = await repository.listAllActive();
    const header = "email,status,source,createdAt,confirmedAt\n";
    const body = subs
      .map((s) =>
        [s.email, s.status, s.source || "", s.createdAt?.toISOString() || "", s.confirmedAt?.toISOString() || ""]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="subscribers.csv"');
    return res.send(header + body);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  subscribe,
  confirm,
  unsubscribe,
  listSubscribers,
  exportSubscribers,
};
