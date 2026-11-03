const express = require("express");
const router = express.Router();
const bookstoreController = require("./controller");
const purchase = require("./purchaseController");
const { upload } = require("../../middleware/upload");
const { authenticate } = require("../../middleware/authmiddleware");
const { optionalAuth } = require("../../middleware/optionalAuth");
const { authorize } = require("../../middleware/rolemiddleware");

// ==================
// Public Routes
// ==================

// Categories
router.get("/categories", bookstoreController.getAllCategories);
router.get("/categories/:id", bookstoreController.getCategoryById);

// Books
router.get("/books", bookstoreController.getAllBooks);
router.get("/books/featured", bookstoreController.getFeaturedBooks);
router.get("/books/category/:categoryId", bookstoreController.getBooksByCategory);

// Purchases (client) — declared before /books/:idOrSlug so they don't collide
router.post("/purchases", authenticate(), purchase.createPurchase);
router.get("/purchases/me", authenticate(), purchase.getMyPurchases);
router.get("/purchases/:id/download", authenticate(), purchase.downloadPurchase);

// Paged preview + related + detail (optional auth so owners can read all pages / get owned flag)
router.get("/books/:id/related", purchase.getRelated);
router.get("/books/:id/pages", optionalAuth(), purchase.getBookPage);
router.get("/books/:idOrSlug", optionalAuth(), purchase.getBookDetail);

// ==================
// Admin Routes
// ==================

// Categories Management
router.post(
  "/admin/categories",
  authorize(["Admin", "SuperAdmin"]),
  bookstoreController.createCategory
);
router.put(
  "/admin/categories/:id",
  authorize(["Admin", "SuperAdmin"]),
  bookstoreController.updateCategory
);
router.delete(
  "/admin/categories/:id",
  authorize(["Admin", "SuperAdmin"]),
  bookstoreController.deleteCategory
);

// Books Management
router.post(
  "/admin/books",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([
    { name: "coverPage", maxCount: 1 },
    { name: "previewPages", maxCount: 20 },
    { name: "previewPdf", maxCount: 1 },
  ]),
  bookstoreController.createBook
);
router.put(
  "/admin/books/:id",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([
    { name: "coverPage", maxCount: 1 },
    { name: "previewPages", maxCount: 20 },
    { name: "previewPdf", maxCount: 1 },
  ]),
  bookstoreController.updateBook
);
router.delete(
  "/admin/books/:id",
  authorize(["Admin", "SuperAdmin"]),
  bookstoreController.deleteBook
);

// Admin: full file (private storage key), paged content, purchase list
router.post(
  "/admin/books/:id/file",
  authorize(["Admin", "SuperAdmin"]),
  purchase.adminSetFile
);
router.post(
  "/admin/books/:id/pages",
  authorize(["Admin", "SuperAdmin"]),
  purchase.adminUploadPages
);
router.get(
  "/admin/purchases",
  authorize(["Admin", "SuperAdmin"]),
  purchase.adminListPurchases
);

module.exports = router;