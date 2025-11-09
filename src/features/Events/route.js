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
} = require("./controller");

/**
 * @swagger
 * /events/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - Title
 *               - Organizer
 *               - Description
 *               - Location
 *               - Date
 *             properties:
 *               Title:
 *                 type: string
 *               Organizer:
 *                 type: string
 *               Description:
 *                 type: string
 *               Location:
 *                 type: array
 *                 items:
 *                   type: string
 *               Date:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: date
 *               EventHighlights:
 *                 type: array
 *                 items:
 *                   type: string
 *               Status:
 *                 type: string
 *                 enum: [upcoming, past, cancelled]
 *               isPublished:
 *                 type: boolean
 *               registrationEnabled:
 *                 type: boolean
 *               volunteerEnabled:
 *                 type: boolean
 *               eventType:
 *                 type: string
 *                 enum: [online, offline, hybrid]
 *               maxAttendees:
 *                 type: integer
 *               registrationDeadline:
 *                 type: string
 *                 format: date-time
 *               Images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */
router.post(
  "/events",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([{ name: "Images", maxCount: 5 }]),
  createEvents
);
router.put(
  "/events/:EventId",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([{ name: "Images", maxCount: 5 }]),
  updateEvents
);
router.delete("/events/:id", authorize(["Admin", "SuperAdmin"]), deleteeventsById);

// Event publishing controls - Admin only
router.post("/events/publish/:id", authorize(["Admin", "SuperAdmin"]), publishEvent);
router.post("/events/unpublish/:id", authorize(["Admin", "SuperAdmin"]), unpublishEvent);
router.post("/events/duplicate/:id", authorize(["Admin", "SuperAdmin"]), duplicateEvent);
router.get("/events/stats/:id", authorize(["Admin", "SuperAdmin"]), getEventStats);
router.get("/events/drafts", authorize(["Admin", "SuperAdmin"]), getDraftEvents);

// Albums - Admin only
router.post(
  "/albums",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([{ name: "Images", maxCount: 5 }]),
  createAlbums
);
router.put(
  "/albums/:AlbumId",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([{ name: "Images", maxCount: 5 }]),
  updateAlbums
);
router.delete("/albums/:id", authorize(["Admin", "SuperAdmin"]), deletealbumsById);

module.exports = router;
