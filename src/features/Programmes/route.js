const express = require("express");
const router = express.Router();
const c = require("./controller");
const { authorize } = require("../../middleware/rolemiddleware");

const admin = authorize(["Admin", "SuperAdmin"]);

// Public
router.get("/programmes", c.listProgrammes);
router.get("/programmes/:slug", c.getProgramme);
router.get("/programmes/:slug/editions", c.listEditions);
router.get("/programmes/:slug/editions/:year", c.getEdition);

// Admin
router.post("/admin/programmes", admin, c.createProgramme);
router.put("/admin/programmes/:id", admin, c.updateProgramme);
router.delete("/admin/programmes/:id", admin, c.deleteProgramme);
router.post("/admin/programmes/:id/editions", admin, c.createEdition);
router.put("/admin/programmes/:id/editions/:year", admin, c.updateEdition);
router.delete("/admin/programmes/:id/editions/:year", admin, c.deleteEdition);

module.exports = router;
