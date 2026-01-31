const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { authenticate } = require("../../middleware/authmiddleware");
const { authorize } = require("../../middleware/rolemiddleware");
const { upload } = require("../../middleware/upload");

// Admin routes (require authentication and admin role)
router.post(
  "/",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  controller.createPodcast
);

router.get(
  "/admin",
  authorize(["Admin", "SuperAdmin"]),
  controller.getAllPodcasts
);

router.put(
  "/:id",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  controller.updatePodcast
);

router.delete(
  "/:id",
  authorize(["Admin", "SuperAdmin"]),
  controller.deletePodcast
);

// Public routes
router.get("/published", controller.getPublishedPodcasts);
router.get("/live", controller.getLivePodcasts);
router.get("/:id", controller.getPodcastById);

module.exports = router;