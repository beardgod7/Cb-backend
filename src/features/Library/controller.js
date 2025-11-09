const repository = require("./repository");
const {
  categorySchema,
  updateCategorySchema,
  bookSchema,
  updateBookSchema,
  readingVisitSchema,
  librarianContactSchema,
} = require("./schema");
const { uploadToCloudinary } = require("../../service/upload/cloudinaryuploader");
const { sendReadingVisitConfirmation, sendLibrarianContactNotification } = require("../../service/emailservice");

// ==================
// Categories (Admin)
// ==================

async function createCategory(req, res, next) {
  try {
    const validatedData = await categorySchema.validateAsync(req.body);
    const category = await repository.createCategory(validatedData);

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const validatedData = await updateCategorySchema.validateAsync(req.body);
    const category = await repository.updateCategory(id, validatedData);

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    await repository.deleteCategory(id);

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    next(err);
  }
}

// ==================
// Categories (Public)
// ==================

async function getAllCategories(req, res, next) {
  try {
    const categories = await repository.getAllCategories();

    res.status(200).json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (err) {
    next(err);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const { id } = req.params;
    const category = await repository.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (err) {
    next(err);
  }
}

// ==================
// Books (Admin)
// ==================

async function createBook(req, res, next) {
  try {
    const userId = req.userId;
    let coverImageUrl = null;
    const previewPageUrls = [];
    const folderName = "Library/Books";

    // Upload cover image
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      coverImageUrl = await uploadToCloudinary(
        req.files.coverImage[0].buffer,
        folderName,
        `cover-${userId}-${req.files.coverImage[0].originalname}`
      );
    }

    // Upload preview pages
    if (req.files && req.files.previewPages) {
      const files = req.files.previewPages.slice(0, 20); // Max 20 preview pages
      for (const file of files) {
        const url = await uploadToCloudinary(
          file.buffer,
          `${folderName}/Previews`,
          `preview-${userId}-${file.originalname}`
        );
        previewPageUrls.push(url);
      }
    }

    const bookData = {
      ...req.body,
      coverImage: coverImageUrl,
      previewPages: previewPageUrls,
      createdBy: userId,
    };

    // Parse categoryIds if it's a string
    if (typeof bookData.categoryIds === "string") {
      bookData.categoryIds = JSON.parse(bookData.categoryIds);
    }

    const categoryIds = bookData.categoryIds || [];
    delete bookData.categoryIds;

    const validatedData = await bookSchema.validateAsync(bookData);
    const book = await repository.createBook(validatedData);

    // Assign categories
    if (categoryIds.length > 0) {
      await repository.assignCategoriesToBook(book.id, categoryIds);
    }

    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (err) {
    console.error("Error creating book:", err);
    next(err);
  }
}

async function updateBook(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    let coverImageUrl = null;
    const previewPageUrls = [];
    const folderName = "Library/Books";

    // Upload new cover image if provided
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      coverImageUrl = await uploadToCloudinary(
        req.files.coverImage[0].buffer,
        folderName,
        `cover-${userId}-${req.files.coverImage[0].originalname}`
      );
    }

    // Upload new preview pages if provided
    if (req.files && req.files.previewPages) {
      const files = req.files.previewPages.slice(0, 20);
      for (const file of files) {
        const url = await uploadToCloudinary(
          file.buffer,
          `${folderName}/Previews`,
          `preview-${userId}-${file.originalname}`
        );
        previewPageUrls.push(url);
      }
    }

    const updateData = {
      ...req.body,
      coverImage: coverImageUrl || undefined,
      previewPages: previewPageUrls.length > 0 ? previewPageUrls : undefined,
    };

    // Parse categoryIds if it's a string
    if (typeof updateData.categoryIds === "string") {
      updateData.categoryIds = JSON.parse(updateData.categoryIds);
    }

    const categoryIds = updateData.categoryIds;
    delete updateData.categoryIds;

    const validatedData = await updateBookSchema.validateAsync(updateData);
    const book = await repository.updateBook(id, validatedData);

    // Update categories if provided
    if (categoryIds && categoryIds.length > 0) {
      await repository.assignCategoriesToBook(id, categoryIds);
    }

    res.status(200).json({
      message: "Book updated successfully",
      book,
    });
  } catch (err) {
    console.error("Error updating book:", err);
    next(err);
  }
}

async function deleteBook(req, res, next) {
  try {
    const { id } = req.params;
    await repository.deleteBook(id);

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    next(err);
  }
}

// ==================
// Books (Public)
// ==================

async function getAllBooks(req, res, next) {
  try {
    const { categoryId, search, featured } = req.query;

    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (search) filter.search = search;
    if (featured === "true") filter.featured = true;

    const books = await repository.getAllBooks(filter);

    res.status(200).json({
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (err) {
    next(err);
  }
}

async function getBookById(req, res, next) {
  try {
    const { id } = req.params;
    const book = await repository.getBookById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (err) {
    next(err);
  }
}

async function getFeaturedBooks(req, res, next) {
  try {
    const books = await repository.getFeaturedBooks();

    res.status(200).json({
      message: "Featured books retrieved successfully",
      data: books,
    });
  } catch (err) {
    next(err);
  }
}

async function getBooksByCategory(req, res, next) {
  try {
    const { categoryId } = req.params;
    const books = await repository.getBooksByCategory(categoryId);

    res.status(200).json({
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (err) {
    next(err);
  }
}

// ==================
// Reading Visits
// ==================

async function bookReadingVisit(req, res, next) {
  try {
    const validatedData = await readingVisitSchema.validateAsync(req.body);
    const userId = req.userId || null;

    const visitData = {
      ...validatedData,
      userId,
    };

    const visit = await repository.createReadingVisit(visitData);

    // Send confirmation email
    if (validatedData.bookId) {
      const book = await repository.getBookById(validatedData.bookId);
      await sendReadingVisitConfirmation(validatedData.email, {
        fullName: validatedData.fullName,
        bookTitle: book?.title || "CBAAC Library",
        preferredDate: validatedData.preferredDate,
      });
    } else {
      await sendReadingVisitConfirmation(validatedData.email, {
        fullName: validatedData.fullName,
        bookTitle: "CBAAC Library",
        preferredDate: validatedData.preferredDate,
      });
    }

    res.status(201).json({
      message: "Reading visit booked successfully. Confirmation email sent.",
      visit,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllReadingVisits(req, res, next) {
  try {
    const visits = await repository.getAllReadingVisits();

    res.status(200).json({
      message: "Reading visits retrieved successfully",
      data: visits,
    });
  } catch (err) {
    next(err);
  }
}

async function updateReadingVisitStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const visit = await repository.updateReadingVisitStatus(id, status, adminNotes);

    res.status(200).json({
      message: "Reading visit updated successfully",
      visit,
    });
  } catch (err) {
    next(err);
  }
}

async function getUserReadingVisits(req, res, next) {
  try {
    const { userId } = req.params;
    const visits = await repository.getReadingVisitsByUser(userId);

    res.status(200).json({
      message: "User reading visits retrieved successfully",
      data: visits,
    });
  } catch (err) {
    next(err);
  }
}

// ==================
// Librarian Contact
// ==================

async function contactLibrarian(req, res, next) {
  try {
    const validatedData = await librarianContactSchema.validateAsync(req.body);
    const contact = await repository.createLibrarianContact(validatedData);

    // Send notification to librarian
    await sendLibrarianContactNotification(validatedData);

    res.status(201).json({
      message: "Message sent to librarian successfully",
      contact,
    });
  } catch (err) {
    next(err);
  }
}

async function getAllLibrarianContacts(req, res, next) {
  try {
    const contacts = await repository.getAllLibrarianContacts();

    res.status(200).json({
      message: "Contacts retrieved successfully",
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
}

async function updateLibrarianContactStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const contact = await repository.updateLibrarianContactStatus(id, status, adminResponse);

    res.status(200).json({
      message: "Contact updated successfully",
      contact,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  createBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getBookById,
  getFeaturedBooks,
  getBooksByCategory,
  bookReadingVisit,
  getAllReadingVisits,
  updateReadingVisitStatus,
  getUserReadingVisits,
  contactLibrarian,
  getAllLibrarianContacts,
  updateLibrarianContactStatus,
};
