const { Op } = require("sequelize");
const sequelize = require("../../config/dbconfig");
const { Film, FilmBooking, FilmTerms } = require("./model");
const { ok } = require("../../utils/apiResponse");

// GET /films/films/top-week?limit=4
// Ranks films by paid tickets (seats) in the last 7 days.
async function topWeek(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 4, 10);
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const rows = await FilmBooking.findAll({
      attributes: [
        "filmId",
        [sequelize.fn("SUM", sequelize.col("numberOfSeats")), "seats"],
      ],
      where: { paymentStatus: "success", createdAt: { [Op.gte]: since } },
      group: ["filmId"],
      order: [[sequelize.literal("seats"), "DESC"]],
      limit,
      raw: true,
    });

    const ranked = [];
    let rank = 1;
    for (const r of rows) {
      const film = await Film.findByPk(r.filmId);
      if (film && film.isActive) {
        ranked.push({ rank: rank++, bookings7d: Number(r.seats), film });
      }
    }

    // Backfill with featured/recent films if fewer than `limit` have sales.
    if (ranked.length < limit) {
      const have = new Set(ranked.map((x) => x.film.id));
      const fillers = await Film.findAll({
        where: { isActive: true, id: { [Op.notIn]: [...have, "00000000-0000-0000-0000-000000000000"] } },
        order: [["isFeatured", "DESC"], ["createdAt", "DESC"]],
        limit: limit - ranked.length,
      });
      for (const f of fillers) ranked.push({ rank: rank++, bookings7d: 0, film: f });
    }

    return ok(res, { message: "Top films of the week", data: ranked });
  } catch (err) {
    next(err);
  }
}

// GET /films/terms
async function getTerms(req, res, next) {
  try {
    let t = await FilmTerms.findByPk(1);
    if (!t) t = await FilmTerms.create({ id: 1, version: "1.0", body: "" });
    return ok(res, { message: "Film terms", data: { version: t.version, body: t.body } });
  } catch (err) {
    next(err);
  }
}

// PUT /films/admin/terms
async function updateTerms(req, res, next) {
  try {
    let t = await FilmTerms.findByPk(1);
    if (!t) t = await FilmTerms.create({ id: 1 });
    if (req.body.version) t.version = req.body.version;
    if (req.body.body !== undefined) t.body = req.body.body;
    await t.save();
    return ok(res, { message: "Film terms updated", data: { version: t.version, body: t.body } });
  } catch (err) {
    next(err);
  }
}

// GET /films/bookings/me
async function myBookings(req, res, next) {
  try {
    const bookings = await FilmBooking.findAll({
      where: { userId: req.userId },
      order: [["createdAt", "DESC"]],
      include: [{ model: Film, attributes: ["id", "slug", "title", "coverImage"] }],
    });
    return ok(res, { message: "Your film bookings", data: bookings });
  } catch (err) {
    next(err);
  }
}

module.exports = { topWeek, getTerms, updateTerms, myBookings };
