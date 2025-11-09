const express = require("express");
const router = express.Router();
const libraryController = require("./controller");
const { upload } = require("../../middleware/upload");
const { authenticate } = require("../../middleware/authmiddleware");
const { authorize } = require("../../middleware/rolemiddleware");

// ==================
// Public Routes
// ==================

// Categories
router.get("/categories", libraryController.getAllCategories);
router.get("/categories/:id", libraryController.getCategoryById);

// Books
router.get("/books", libraryController.getAllBooks);
router.get("/books/featured", libraryController.getFeaturedBooks);
router.get("/books/:id", libraryController.getBookById);
router.get("/books/category/:categoryId", libraryController.getBooksByCategory);

// Reading Visits
router.post("/reading-visits/book", libraryController.bookReadingVisit);

// Librarian Contact
router.post("/contact-librarian", libraryController.contactLibrarian);

// ==================
// User Routes (Authenticated)
// ==================

router.get(
  "/reading-visits/user/:userId",
  authenticate(),
  libraryController.getUserReadingVisits
);

// ==================
// Admin Routes
// ==================

// Categories Management
router.post(
  "/admin/categories",
  authorize(["Admin", "SuperAdmin"]),
  libraryController.createCategory
);
router.put(
  "/admin/categories/:id",
  authorize(["Admin", "SuperAdmin"]),
  libraryController.updateCategory
);
router.delete(
  "/admin/categories/:id",
  authorize(["Admin", "SuperAdmin"]),
  libraryController.deleteCategory
);

// Books Management
router.post(
  "/admin/books",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "previewPages", maxCount: 20 },
  ]),
  libraryController.createBook
);
router.put(
  "/admin/books/:id",
  authorize(["Admin", "SuperAdmin"]),
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "previewPages", maxCount: 20 },
  ]),
  libraryController.updateBook
);
router.delete(
  "/admin/books/:id",
  authorize(["Admin", "SuperAdmin"]),
  libraryController.deleteBook
);

// Reading Visits Management
router.get(
  "/admin/reading-visits",
  authorize(["Admin", "SuperAdmin"]),
  libraryController.getAllReadingVisits
);
router.patch(
  "/admin/reading-visits/:id",
  authorize(["Admin", "SuperAdmin"]),
  libraryController.updateReadingVisitStatus
);

// Librarian Contacts Management
router.get(
  "/admin/contacts",
  authorize(["Admin", "SuperAdmin"]),
  libraryController.getAllLibrarianContacts
);
router.patch(
  "/admin/contacts/:id",
  authorize(["Admin", "SuperAdmin"]),
  libraryController.updateLibrarianContactStatus
);

module.exports = router;
