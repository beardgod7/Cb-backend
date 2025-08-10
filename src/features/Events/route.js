const express = require("express");
const router = express.Router();
const { upload } = require("../../middleware/upload");

const {
  createEvents,
  createAlbums,
  updateAlbums,
  updateEvents,
  deleteeventsById,
  deletealbumsById,
} = require("./controller");

// Events
router.post(
  "/events",
  upload.fields([{ name: "Images", maxCount: 5 }]),
  createEvents
);
router.put(
  "/events/:EventId",
  upload.fields([{ name: "Images", maxCount: 5 }]),
  updateEvents
);
router.delete("/events/:id", deleteeventsById);
// Albums
router.post(
  "/albums",
  upload.fields([{ name: "Images", maxCount: 5 }]),
  createAlbums
);
router.put(
  "/albums/:AlbumId",
  upload.fields([{ name: "Images", maxCount: 5 }]),
  updateAlbums
);
router.delete("/albums/:id", deletealbumsById);

module.exports = router;
