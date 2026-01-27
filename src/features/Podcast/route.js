const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { authenticateToken } = require("../../middleware/authentication");
const { authorize } = require("../../middleware/rolemiddleware");

// Admin routes (require authentication and admin role)
router.post(
  "/",
  authenticateToken,
  authorize(["Admin", "SuperAdmin"]),
  controller.createPodcast
);

router.get(
  "/admin",
  authenticateToken,
  authorize(["Admin", "SuperAdmin"]),
  controller.getAllPodcasts
);

router.put(
  "/:id",
  authenticateToken,
  authorize(["Admin", "SuperAdmin"]),
  controller.updatePodcast
);

router.delete(
  "/:id",
  authenticateToken,
  authorize(["Admin", "SuperAdmin"]),
  controller.deletePodcast
);

// Public routes
router.get("/published", controller.getPublishedPodcasts);
router.get("/live", controller.getLivePodcasts);
router.get("/:id", controller.getPodcastById);

module.exports = router;