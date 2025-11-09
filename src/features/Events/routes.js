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

const router = express.Router();

// Public routes
router.get("/albums", getAllalbum);
router.get("/albums/:id", getallbumById);
router.get("/events", getAllevents);
router.get("/events/published", getPublishedEvents);
router.get("/events/past", getPastEvents);
router.get("/events/upcoming", getUpcomingEvents);
router.get("/events/:id", geteventsbyid);

module.exports = router;
