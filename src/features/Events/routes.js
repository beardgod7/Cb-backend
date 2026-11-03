const express = require("express");
const {
  getAllevents,
  geteventsbyid,
  getAllalbum,
  getallbumById,
  getPublishedEvents,
  getPastEvents,
  getUpcomingEvents,
} = require("./controller");
const { getEventCalendar, getAlbumsByEvent } = require("./extras");

const router = express.Router();

// Public routes
router.get("/albums", getAlbumsByEvent); // supports ?eventId=
router.get("/albums/:id", getallbumById);
router.get("/events", getAllevents);
router.get("/events/published", getPublishedEvents);
router.get("/events/past", getPastEvents);
router.get("/events/upcoming", getUpcomingEvents);
router.get("/events/:id/calendar.ics", getEventCalendar);
router.get("/events/:id", geteventsbyid);

module.exports = router;
