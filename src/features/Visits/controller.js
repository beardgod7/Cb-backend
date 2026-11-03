const repository = require("./repository");
const { createVisitSchema, reviewVisitSchema, settingsSchema } = require("./schema");
const { resolveResource } = require("./resourceRegistry");
const { ok, AppError } = require("../../utils/apiResponse");
const { getPagination, buildListResponse } = require("../../utils/pagination");
const { sendMail } = require("../../service/emailservice");
const { findUserById } = require("../Authentication/repository");

function todayLagos() {
  // Africa/Lagos has no DST and is UTC+1 year round.
  const now = new Date(Date.now() + 60 * 60 * 1000);
  return now.toISOString().slice(0, 10);
}

function weekdayOf(dateStr) {
  // Interpret as a plain date at Lagos midnight.
  return new Date(`${dateStr}T00:00:00+01:00`).getUTCDay();
}

async function dateStatus(dateStr, settings, usedMap) {
  const today = todayLagos();
  const used = usedMap ? usedMap[dateStr] || 0 : await repository.countForDate(dateStr);
  const remaining = Math.max(0, settings.dailyCapacity - used);

  let available = true;
  if (dateStr <= today) available = false; // past or today (leadDays >= 1)
  else if (!settings.openWeekdays.includes(weekdayOf(dateStr))) available = false;
  else if ((settings.closedDates || []).includes(dateStr)) available = false;
  else if (remaining <= 0) available = false;

  return { date: dateStr, available, remaining };
}

async function availability(req, res, next) {
  try {
    const { from, to } = req.query;
    if (!from || !to) throw new AppError("BAD_REQUEST", "from and to are required", 400);

    const settings = await repository.getSettings();
    const usedMap = await repository.countsInRange(from, to);

    const dates = [];
    let cur = new Date(`${from}T00:00:00+01:00`);
    const end = new Date(`${to}T00:00:00+01:00`);
    let guard = 0;
    while (cur <= end && guard < 400) {
      const d = cur.toISOString().slice(0, 10);
      dates.push(await dateStatus(d, settings, usedMap));
      cur = new Date(cur.getTime() + 24 * 60 * 60 * 1000);
      guard++;
    }

    return ok(res, { message: "Availability", data: { dates } });
  } catch (err) {
    next(err);
  }
}

async function createVisit(req, res, next) {
  try {
    const data = await createVisitSchema.validateAsync(req.body);
    const settings = await repository.getSettings();
    const today = todayLagos();

    if (data.visitDate <= today) {
      throw new AppError("DATE_IN_PAST", "Pick a future date", 400);
    }

    const status = await dateStatus(data.visitDate, settings);
    if (!status.available) {
      throw new AppError("DATE_UNAVAILABLE", "That date is closed, past or full", 400);
    }

    // Resource must exist (if the type has a resolver).
    const resource = await resolveResource(data.resourceType, data.resourceId);
    if (resource === null) {
      throw new AppError("RESOURCE_NOT_FOUND", "Unknown book or archive item", 404);
    }

    const dup = await repository.hasActiveVisitOnDate(req.userId, data.visitDate);
    if (dup) {
      throw new AppError("DUPLICATE_VISIT", "You already have a visit booked that day", 409);
    }

    const visit = await repository.create({
      userId: req.userId,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      resourceTitle: resource ? resource.title : null,
      visitDate: data.visitDate,
      note: data.note || null,
      status: "pending",
    });

    // Email the reader (nice-to-have).
    try {
      const user = await findUserById(req.userId);
      if (user && user.email) {
        await sendMail({
          to: user.email,
          subject: "Your CBAAC visit request was received",
          html: `<p>We received your request to visit on <strong>${visit.visitDate}</strong>.</p>
                 <p>${visit.resourceTitle ? `For: ${visit.resourceTitle}` : ""}</p>
                 <p>We'll email you once it's approved.</p>`,
        });
      }
    } catch (_) {}

    return ok(res, {
      status: 201,
      message: "Visit requested",
      data: {
        id: visit.id,
        status: visit.status,
        visitDate: visit.visitDate,
        resourceTitle: visit.resourceTitle,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function myVisits(req, res, next) {
  try {
    const visits = await repository.listByUser(req.userId);
    return ok(res, { message: "Your visits", data: visits });
  } catch (err) {
    next(err);
  }
}

async function cancelVisit(req, res, next) {
  try {
    const visit = await repository.findById(req.params.id);
    if (!visit || String(visit.userId) !== String(req.userId)) {
      throw new AppError("NOT_FOUND", "Visit not found", 404);
    }
    if (!["pending", "approved"].includes(visit.status)) {
      throw new AppError("CANNOT_CANCEL", "This visit can't be cancelled", 400);
    }
    visit.status = "cancelled";
    await visit.save();
    return ok(res, { message: "Visit cancelled", data: { id: visit.id, status: visit.status } });
  } catch (err) {
    next(err);
  }
}

// ===== Admin =====
async function adminList(req, res, next) {
  try {
    const { page, limit, offset } = getPagination(req.query, { defaultLimit: 20 });
    const { rows, count } = await repository.listAdmin({
      status: req.query.status,
      resourceType: req.query.resourceType,
      from: req.query.from,
      to: req.query.to,
      offset,
      limit,
    });
    return ok(res, { message: "Visits", data: buildListResponse(rows, count, page, limit) });
  } catch (err) {
    next(err);
  }
}

async function adminReview(req, res, next) {
  try {
    const { status, adminNote } = await reviewVisitSchema.validateAsync(req.body);
    const visit = await repository.findById(req.params.id);
    if (!visit) throw new AppError("NOT_FOUND", "Visit not found", 404);

    visit.status = status;
    visit.adminNote = adminNote || null;
    visit.reviewedAt = new Date();
    visit.reviewedBy = req.userId || null;
    await visit.save();

    try {
      const user = await findUserById(visit.userId);
      if (user && user.email) {
        await sendMail({
          to: user.email,
          subject: `Your CBAAC visit was ${status}`,
          html: `<p>Your visit on <strong>${visit.visitDate}</strong> was <strong>${status}</strong>.</p>${
            adminNote ? `<p>${adminNote}</p>` : ""
          }`,
        });
      }
    } catch (_) {}

    return ok(res, { message: `Visit ${status}`, data: visit });
  } catch (err) {
    next(err);
  }
}

async function adminGetSettings(req, res, next) {
  try {
    const s = await repository.getSettings();
    return ok(res, { message: "Visit settings", data: s });
  } catch (err) {
    next(err);
  }
}

async function adminUpdateSettings(req, res, next) {
  try {
    const data = await settingsSchema.validateAsync(req.body);
    const s = await repository.updateSettings(data);
    return ok(res, { message: "Visit settings updated", data: s });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  availability,
  createVisit,
  myVisits,
  cancelVisit,
  adminList,
  adminReview,
  adminGetSettings,
  adminUpdateSettings,
};
