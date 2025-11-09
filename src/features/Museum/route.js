const express = require("express");
const router = express.Router();
const museumController = require("./controller");
const { upload } = require("../../middleware/upload");
const { authenticate } = require("../../middleware/authmiddleware");
const { authorize } = require("../../middleware/rolemiddleware");

// ==================
// Public Routes
// ==================

// Artifacts
router.get("/artifacts", museumController.getAllArtifacts);
router.get("/artifacts/featured", museumController.getFeaturedArtifacts);
router.get("/artifacts/:id", museumController.getArtifactById);
router.get("/filter-options", museumController.getFilterOptions);

// Rental Requests
router.post("/rental-requests", museumController.createRentalRequest);

// Collaboration Requests
router.post("/collaboration-requests", museumController.createCollaborationRequest);

// ==================
// User Routes (Authenticated)
// ==================

router.get(
  "/rental-requests/user/:userId",
  authenticate(),
  museumController.getUserRentalRequests
);

// ==================
// Admin Routes
// ==================

// Artifacts Management
router.post(
  "/admin/artifacts",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "audioNarration", maxCount: 1 },
  ]),
  museumController.createArtifact
);
router.put(
  "/admin/artifacts/:id",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "audioNarration", maxCount: 1 },
  ]),
  museumController.updateArtifact
);
router.delete(
  "/admin/artifacts/:id",
  authorize(["Admin", "SuperAdmin"]),
  museumController.deleteArtifact
);

// Rental Requests Management
router.get(
  "/admin/rental-requests",
  authorize(["Admin", "SuperAdmin"]),
  museumController.getAllRentalRequests
);
router.patch(
  "/admin/rental-requests/:id",
  authorize(["Admin", "SuperAdmin"]),
  museumController.updateRentalRequestStatus
);

// Collaboration Requests Management
router.get(
  "/admin/collaboration-requests",
  authorize(["Admin", "SuperAdmin"]),
  museumController.getAllCollaborationRequests
);
router.patch(
  "/admin/collaboration-requests/:id",
  authorize(["Admin", "SuperAdmin"]),
  museumController.updateCollaborationRequestStatus
);

module.exports = router;
