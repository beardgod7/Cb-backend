const repository = require("./repository");
const {
  bookstoreCategorySchema,
  updateBookstoreCategorySchema,
  bookstoreBookSchema,
  updateBookstoreBookSchema,
} = require("./schema");
const { uploadToCloudinary } = require("../../service/upload/cloudinaryuploader");

// ==================
// Categories (Admin)
// ==================

async function createCategory(req, res, next) {
  try {
    const validatedData = await bookstoreCategorySchema.validateAsync(req.body);
    const category = await repository.createCategory(validatedData);

    res.status(201).json({
      message: "Bookstore category created successfully",
      category,
    });
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const validatedData = await updateBookstoreCategorySchema.validateAsync(req.body);
    const category = await repository.updateCategory(id, validatedData);

    res.status(200).json({
      message: "Bookstore category updated successfully",
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

    res.status(200).json({ message: "Bookstore category deleted successfully" });
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
      message: "Bookstore categories retrieved successfully",
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
      return res.status(404).json({ message: "Bookstore category not found" });
    }

    res.status(200).json({
      message: "Bookstore category retrieved successfully",
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
    let coverPageUrl = null;
    let previewPagesData = null;
    const folderName = "Bookstore/Books";

    // Upload cover page
    if (req.files && req.files.coverPage && req.files.coverPage[0]) {
      coverPageUrl = await uploadToCloudinary(
        req.files.coverPage[0].buffer,
        folderName,
        `cover-${userId}-${req.files.coverPage[0].originalname}`
      );
    }

    // Handle preview pages based on type
    const previewType = req.body.previewType || "text";
    
    if (previewType === "images" && req.files && req.files.previewPages) {
      // Upload preview page images
      const previewImageUrls = [];
      const files = req.files.previewPages.slice(0, 20); // Max 20 preview pages
      
      for (const file of files) {
        const url = await uploadToCloudinary(
          file.buffer,
          `${folderName}/Previews`,
          `preview-${userId}-${file.originalname}`
        );
        previewImageUrls.push(url);
      }
      previewPagesData = previewImageUrls;
    } else if (previewType === "pdf" && req.files && req.files.previewPdf && req.files.previewPdf[0]) {
      // Upload preview PDF
      const pdfUrl = await uploadToCloudinary(
        req.files.previewPdf[0].buffer,
        `${folderName}/Previews`,
        `preview-${userId}-${req.files.previewPdf[0].originalname}`
      );
      previewPagesData = pdfUrl;
    } else if (previewType === "text" && req.body.previewPages) {
      // Parse text preview pages
      try {
        previewPagesData = JSON.parse(req.body.previewPages);
      } catch (error) {
        return res.status(400).json({ message: "Invalid preview pages format" });
      }
    }

    const bookData = {
      ...req.body,
      coverPage: coverPageUrl,
      previewPages: previewPagesData,
      previewType,
      createdBy: userId,
    };

    // Parse editors if it's a string
    if (typeof bookData.editors === "string") {
      try {
        bookData.editors = JSON.parse(bookData.editors);
      } catch (error) {
        bookData.editors = bookData.editors.split(",").map(editor => editor.trim());
      }
    }

    // Parse categoryIds if it's a string
    if (typeof bookData.categoryIds === "string") {
      bookData.categoryIds = JSON.parse(bookData.categoryIds);
    }

    const categoryIds = bookData.categoryIds || [];
    delete bookData.categoryIds;

    const validatedData = await bookstoreBookSchema.validateAsync(bookData);
    const book = await repository.createBook(validatedData);

    // Assign categories
    if (categoryIds.length > 0) {
      await repository.assignCategoriesToBook(book.id, categoryIds);
    }

    res.status(201).json({
      message: "Bookstore book created successfully",
      book,
    });
  } catch (err) {
    console.error("Error creating bookstore book:", err);
    next(err);
  }
}

async function updateBook(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.userId;
    let coverPageUrl = null;
    let previewPagesData = null;
    const folderName = "Bookstore/Books";

    // Upload new cover page if provided
    if (req.files && req.files.coverPage && req.files.coverPage[0]) {
      coverPageUrl = await uploadToCloudinary(
        req.files.coverPage[0].buffer,
        folderName,
        `cover-${userId}-${req.files.coverPage[0].originalname}`
      );
    }

    // Handle preview pages based on type
    const previewType = req.body.previewType;
    
    if (previewType === "images" && req.files && req.files.previewPages) {
      const previewImageUrls = [];
      const files = req.files.previewPages.slice(0, 20);
      
      for (const file of files) {
        const url = await uploadToCloudinary(
          file.buffer,
          `${folderName}/Previews`,
          `preview-${userId}-${file.originalname}`
        );
        previewImageUrls.push(url);
      }
      previewPagesData = previewImageUrls;
    } else if (previewType === "pdf" && req.files && req.files.previewPdf && req.files.previewPdf[0]) {
      const pdfUrl = await uploadToCloudinary(
        req.files.previewPdf[0].buffer,
        `${folderName}/Previews`,
        `preview-${userId}-${req.files.previewPdf[0].originalname}`
      );
      previewPagesData = pdfUrl;
    } else if (previewType === "text" && req.body.previewPages) {
      try {
        previewPagesData = JSON.parse(req.body.previewPages);
      } catch (error) {
        return res.status(400).json({ message: "Invalid preview pages format" });
      }
    }

    const updateData = {
      ...req.body,
      coverPage: coverPageUrl || undefined,
      previewPages: previewPagesData !== null ? previewPagesData : undefined,
    };

    // Parse editors if it's a string
    if (typeof updateData.editors === "string") {
      try {
        updateData.editors = JSON.parse(updateData.editors);
      } catch (error) {
        updateData.editors = updateData.editors.split(",").map(editor => editor.trim());
      }
    }

    // Parse categoryIds if it's a string
    if (typeof updateData.categoryIds === "string") {
      updateData.categoryIds = JSON.parse(updateData.categoryIds);
    }

    const categoryIds = updateData.categoryIds;
    delete updateData.categoryIds;

    const validatedData = await updateBookstoreBookSchema.validateAsync(updateData);
    const book = await repository.updateBook(id, validatedData);

    // Update categories if provided
    if (categoryIds && categoryIds.length > 0) {
      await repository.assignCategoriesToBook(id, categoryIds);
    }

    res.status(200).json({
      message: "Bookstore book updated successfully",
      book,
    });
  } catch (err) {
    console.error("Error updating bookstore book:", err);
    next(err);
  }
}

async function deleteBook(req, res, next) {
  try {
    const { id } = req.params;
    await repository.deleteBook(id);

    res.status(200).json({ message: "Bookstore book deleted successfully" });
  } catch (err) {
    next(err);
  }
}

// ==================
// Books (Public)
// ==================

async function getAllBooks(req, res, next) {
  try {
    const { categoryId, search, featured, minPrice, maxPrice } = req.query;

    const filter = {};
    if (categoryId) filter.categoryId = categoryId;
    if (search) filter.search = search;
    if (featured === "true") filter.featured = true;
    if (minPrice) filter.minPrice = parseFloat(minPrice);
    if (maxPrice) filter.maxPrice = parseFloat(maxPrice);

    const books = await repository.getAllBooks(filter);

    res.status(200).json({
      message: "Bookstore books retrieved successfully",
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
      return res.status(404).json({ message: "Bookstore book not found" });
    }

    res.status(200).json({
      message: "Bookstore book retrieved successfully",
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
      message: "Featured bookstore books retrieved successfully",
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
      message: "Bookstore books retrieved successfully",
      data: books,
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
};