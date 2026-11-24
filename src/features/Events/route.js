const express = require("express");
const router = express.Router();
const { upload } = require("../../middleware/upload");
const { authorize } = require("../../middleware/rolemiddleware");

const {
  createEvents,
  createAlbums,
  updateAlbums,
  updateEvents,
  deleteeventsById,
  deletealbumsById,
  publishEvent,
  unpublishEvent,
  duplicateEvent,
  getEventStats,
  getDraftEvents,
  getAllevents,
  geteventsbyid,
  getAllalbum,
  getallbumById,
  getPublishedEvents,
  getPastEvents,
  getUpcomingEvents,
} = require("./controller");

// ==================
// Public Routes
// ==================

// Albums
router.get("/albums", getAllalbum);
router.get("/albums/:id", getallbumById);

// Events
router.get("/published", getPublishedEvents);
router.get("/past", getPastEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/:id", geteventsbyid);
router.get("/", getAllevents);

// ==================
// Admin Routes
// ==================

/**
 * @swagger
 * /events/admin:
 *   post:
 *     summary: Create a new event
 *     tags: [Events Admin]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/admin",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([{ name: "Images", maxCount: 5 }]),
  createEvents
);
router.put(
  "/admin/:EventId",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([{ name: "Images", maxCount: 5 }]),
  updateEvents
);
router.delete("/admin/:id", authorize(["Admin", "SuperAdmin"]), deleteeventsById);

// Event publishing controls - Admin only
router.post("/admin/publish/:id", authorize(["Admin", "SuperAdmin"]), publishEvent);
router.post("/admin/unpublish/:id", authorize(["Admin", "SuperAdmin"]), unpublishEvent);
router.post("/admin/duplicate/:id", authorize(["Admin", "SuperAdmin"]), duplicateEvent);
router.get("/admin/stats/:id", authorize(["Admin", "SuperAdmin"]), getEventStats);
router.get("/admin/drafts", authorize(["Admin", "SuperAdmin"]), getDraftEvents);

// Albums - Admin only
router.post(
  "/admin/albums",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([{ name: "Images", maxCount: 5 }]),
  createAlbums
);
router.put(
  "/admin/albums/:AlbumId",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([{ name: "Images", maxCount: 5 }]),
  updateAlbums
);
router.delete("/admin/albums/:id", authorize(["Admin", "SuperAdmin"]), deletealbumsById);

module.exports = router;
