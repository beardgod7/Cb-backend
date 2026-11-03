const express = require("express");
const router = express.Router();
const c = require("./controller");
const { authorize } = require("../../middleware/rolemiddleware");

const admin = authorize(["Admin", "SuperAdmin"]);

// ===== Public =====
router.get("/archives/collections", c.getCollections);
router.get("/archives/collections/:slug", c.getCollection);
router.get("/archives/items", c.getItems);
router.get("/archives/items/:slug", c.getItem);
router.get("/archives/items/:slug/pages", c.getItemPage);

// ===== Admin =====
router.post("/admin/archives/collections", admin, c.adminCreateCollection);
router.patch("/admin/archives/collections/:id", admin, c.adminUpdateCollection);
router.delete("/admin/archives/collections/:id", admin, c.adminDeleteCollection);

router.post("/admin/archives/subcategories", admin, c.adminCreateSubcategory);
router.patch("/admin/archives/subcategories/:id", admin, c.adminUpdateSubcategory);
router.delete("/admin/archives/subcategories/:id", admin, c.adminDeleteSubcategory);

router.get("/admin/archives/items", admin, c.adminListItems);
router.post("/admin/archives/items", admin, c.adminCreateItem);
router.patch("/admin/archives/items/:id/publish", admin, c.adminPublishItem);
router.patch("/admin/archives/items/:id", admin, c.adminUpdateItem);
router.delete("/admin/archives/items/:id", admin, c.adminDeleteItem);
router.post("/admin/archives/items/:id/pages", admin, c.adminUploadPages);

module.exports = router;
