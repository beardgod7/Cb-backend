const express = require("express");
const router = express.Router();
const bookstoreController = require("./controller");
const { upload } = require("../../middleware/upload");
const { authenticate } = require("../../middleware/authmiddleware");
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
router.get("/books/:id", bookstoreController.getBookById);
router.get("/books/category/:categoryId", bookstoreController.getBooksByCategory);

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

module.exports = router;