const express = require("express");
const {
  getAllevents,
  geteventsbyid,
  getAllalbum,
  getallbumById,
} = require("./controller");

const router = express.Router();

router.get("/albums", getAllalbum);
router.get("/albums/:id", getallbumById);
router.get("/events", getAllevents);
router.get("/events/:id", geteventsbyid);
module.exports = router;
