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
    const folderName = "Library/Books";

    // Upload cover image
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      coverImageUrl = await uploadToCloudinary(
        req.files.coverImage[0].buffer,
        folderName,
        `cover-${userId}-${req.files.coverImage[0].originalname}`
      );
    }

    // Helper function to process different content types
    const processContentField = async (fieldName, contentType, textData) => {
      if (contentType === "images" && req.files && req.files[`${fieldName}Images`]) {
        const imageUrls = [];
        const files = req.files[`${fieldName}Images`].slice(0, 20);
        for (const file of files) {
          const url = await uploadToCloudinary(
            file.buffer,
            `${folderName}/${fieldName}`,
            `${fieldName}-${userId}-${file.originalname}`
          );
          imageUrls.push(url);
        }
        return imageUrls;
      } else if (contentType === "pdf" && req.files && req.files[`${fieldName}Pdf`] && req.files[`${fieldName}Pdf`][0]) {
        const fileUrl = await uploadToCloudinary(
          req.files[`${fieldName}Pdf`][0].buffer,
          `${folderName}/${fieldName}`,
          `${fieldName}-${userId}-${req.files[`${fieldName}Pdf`][0].originalname}`
        );
        return fileUrl;
      } else if (contentType === "text" && textData) {
        // Skip processing if it's just the placeholder "string"
        if (textData === "string") {
          return null;
        }
        try {
          return typeof textData === "string" ? JSON.parse(textData) : textData;
        } catch (error) {
          // If JSON parsing fails, return as plain text
          return textData;
        }
      }
      return null;
    };

    // Process all content fields
    const previewPages = await processContentField("previewPages", req.body.previewPagesType, req.body.previewPagesText);
    const tableOfContents = await processContentField("tableOfContents", req.body.tableOfContentsType, req.body.tableOfContentsText);
    const abstractPreview = await processContentField("abstractPreview", req.body.abstractPreviewType, req.body.abstractPreviewText);
    const otherPreviewPages = await processContentField("otherPreviewPages", req.body.otherPreviewPagesType, req.body.otherPreviewPagesText);

    const bookData = {
      ...req.body,
      coverImage: coverImageUrl,
      previewPages,
      tableOfContents,
      abstractPreview,
      otherPreviewPages,
      createdBy: userId,
    };

    // Remove null fields to avoid validation issues
    Object.keys(bookData).forEach(key => {
      if (bookData[key] === null) {
        delete bookData[key];
      }
    });

    // Parse categoryIds if it's a string
    if (typeof bookData.categoryIds === "string") {
      // Skip processing if it's just the placeholder "string"
      if (bookData.categoryIds === "string") {
        bookData.categoryIds = [];
      } else {
        try {
          bookData.categoryIds = JSON.parse(bookData.categoryIds);
        } catch (error) {
          console.error("Error parsing categoryIds:", error);
          bookData.categoryIds = [];
        }
      }
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
    const folderName = "Library/Books";

    // Upload new cover image if provided
    if (req.files && req.files.coverImage && req.files.coverImage[0]) {
      coverImageUrl = await uploadToCloudinary(
        req.files.coverImage[0].buffer,
        folderName,
        `cover-${userId}-${req.files.coverImage[0].originalname}`
      );
    }

    // Helper function to process different content types
    const processContentField = async (fieldName, contentType, textData) => {
      if (contentType === "images" && req.files && req.files[`${fieldName}Images`]) {
        const imageUrls = [];
        const files = req.files[`${fieldName}Images`].slice(0, 20);
        for (const file of files) {
          const url = await uploadToCloudinary(
            file.buffer,
            `${folderName}/${fieldName}`,
            `${fieldName}-${userId}-${file.originalname}`
          );
          imageUrls.push(url);
        }
        return imageUrls;
      } else if (contentType === "pdf" && req.files && req.files[`${fieldName}Pdf`] && req.files[`${fieldName}Pdf`][0]) {
        const fileUrl = await uploadToCloudinary(
          req.files[`${fieldName}Pdf`][0].buffer,
          `${folderName}/${fieldName}`,
          `${fieldName}-${userId}-${req.files[`${fieldName}Pdf`][0].originalname}`
        );
        return fileUrl;
      } else if (contentType === "text" && textData) {
        // Skip processing if it's just the placeholder "string"
        if (textData === "string") {
          return undefined;
        }
        try {
          return typeof textData === "string" ? JSON.parse(textData) : textData;
        } catch (error) {
          // If JSON parsing fails, return as plain text
          return textData;
        }
      }
      return undefined;
    };

    // Process all content fields
    const previewPages = req.body.previewPagesType ? 
      await processContentField("previewPages", req.body.previewPagesType, req.body.previewPagesText) : undefined;
    const tableOfContents = req.body.tableOfContentsType ? 
      await processContentField("tableOfContents", req.body.tableOfContentsType, req.body.tableOfContentsText) : undefined;
    const abstractPreview = req.body.abstractPreviewType ? 
      await processContentField("abstractPreview", req.body.abstractPreviewType, req.body.abstractPreviewText) : undefined;
    const otherPreviewPages = req.body.otherPreviewPagesType ? 
      await processContentField("otherPreviewPages", req.body.otherPreviewPagesType, req.body.otherPreviewPagesText) : undefined;

    const updateData = {
      ...req.body,
      coverImage: coverImageUrl || undefined,
      previewPages: previewPages !== undefined ? previewPages : undefined,
      tableOfContents: tableOfContents !== undefined ? tableOfContents : undefined,
      abstractPreview: abstractPreview !== undefined ? abstractPreview : undefined,
      otherPreviewPages: otherPreviewPages !== undefined ? otherPreviewPages : undefined,
    };

    // Remove null and undefined fields to avoid validation issues
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === null || updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Parse categoryIds if it's a string
    if (typeof updateData.categoryIds === "string") {
      // Skip processing if it's just the placeholder "string"
      if (updateData.categoryIds === "string") {
        updateData.categoryIds = undefined;
      } else {
        try {
          updateData.categoryIds = JSON.parse(updateData.categoryIds);
        } catch (error) {
          console.error("Error parsing categoryIds:", error);
          updateData.categoryIds = undefined;
        }
      }
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

async function getMostPopularBooks(req, res, next) {
  try {
    const books = await repository.getMostPopularBooks();

    res.status(200).json({
      message: "Most popular books retrieved successfully",
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
  getMostPopularBooks,
  getBooksByCategory,
  bookReadingVisit,
  getAllReadingVisits,
  updateReadingVisitStatus,
  getUserReadingVisits,
  contactLibrarian,
  getAllLibrarianContacts,
  updateLibrarianContactStatus,
};
