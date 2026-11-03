/**
 * Extra public Events endpoints from the spec:
 *   GET /events/:id/calendar.ics — iCalendar file for "ICAL Import".
 *   GET /events/albums?eventId=   — album for a past event's gallery.
 */
const { Events, Albums } = require("./model");
const { buildICS } = require("../../utils/calendarHelper");
const { ok, AppError } = require("../../utils/apiResponse");

const SITE_URL = process.env.SITE_URL || "https://cbaac.gov.ng";

async function getEventCalendar(req, res, next) {
  try {
    const event = await Events.findByPk(req.params.id);
    if (!event) throw new AppError("NOT_FOUND", "Event not found", 404);

    const venue = event.venue || {};
    const locationStr =
      venue.name || (Array.isArray(event.Location) ? event.Location.join(", ") : event.Location) || "";

    const ics = buildICS({
      uid: event.id,
      title: event.Title,
      description: event.Description,
      startAt: event.startAt,
      endAt: event.endAt,
      location: locationStr,
      url: event.slug ? `${SITE_URL}/events/${event.slug}` : `${SITE_URL}/events/${event.id}`,
    });

    res.setHeader("Content-Type", "text/calendar; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="event-${event.id}.ics"`);
    return res.status(200).send(ics);
  } catch (err) {
    next(err);
  }
}

async function getAlbumsByEvent(req, res, next) {
  try {
    const { eventId } = req.query;
    if (eventId) {
      const event = await Events.findByPk(eventId);
      if (event && event.albumId) {
        const album = await Albums.findByPk(event.albumId);
        return ok(res, { message: "Event album", data: album ? [album] : [] });
      }
      return ok(res, { message: "Event album", data: [] });
    }
    const albums = await Albums.findAll({ order: [["createdAt", "DESC"]] });
    return ok(res, { message: "Albums", data: albums });
  } catch (err) {
    next(err);
  }
}

module.exports = { getEventCalendar, getAlbumsByEvent };
