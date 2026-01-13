const { Op } = require("sequelize");
const { 
  BookstoreBook, 
  BookstoreCategory, 
  BookstoreBookCategory 
} = require("./model");

// ==================
// Categories
// ==================

async function createCategory(categoryData) {
  return await BookstoreCategory.create(categoryData);
}

async function getAllCategories() {
  return await BookstoreCategory.findAll({
    where: { isActive: true },
    order: [["name", "ASC"]],
  });
}

async function getCategoryById(id) {
  return await BookstoreCategory.findOne({
    where: { id, isActive: true },
    include: [
      {
        model: BookstoreBook,
        as: "books",
        where: { isActive: true },
        required: false,
        through: { attributes: [] },
      },
    ],
  });
}

async function updateCategory(id, updateData) {
  const [updatedRowsCount] = await BookstoreCategory.update(updateData, {
    where: { id },
  });

  if (updatedRowsCount === 0) {
    throw new Error("Category not found");
  }

  return await getCategoryById(id);
}

async function deleteCategory(id) {
  const deletedRowsCount = await BookstoreCategory.destroy({
    where: { id },
  });

  if (deletedRowsCount === 0) {
    throw new Error("Category not found");
  }

  return true;
}

// ==================
// Books
// ==================

async function createBook(bookData) {
  return await BookstoreBook.create(bookData);
}

async function getAllBooks(filter = {}) {
  const whereClause = { isActive: true };
  const includeClause = [
    {
      model: BookstoreCategory,
      as: "categories",
      where: { isActive: true },
      required: false,
      through: { attributes: [] },
    },
  ];

  // Apply filters
  if (filter.search) {
    whereClause[Op.or] = [
      { title: { [Op.iLike]: `%${filter.search}%` } },
      { author: { [Op.iLike]: `%${filter.search}%` } },
      { shortDescription: { [Op.iLike]: `%${filter.search}%` } },
    ];
  }

  if (filter.featured) {
    whereClause.isFeatured = true;
  }

  if (filter.categoryId) {
    includeClause[0].where.id = filter.categoryId;
    includeClause[0].required = true;
  }

  if (filter.minPrice) {
    whereClause.price = { [Op.gte]: filter.minPrice };
  }

  if (filter.maxPrice) {
    whereClause.price = { 
      ...whereClause.price, 
      [Op.lte]: filter.maxPrice 
    };
  }

  return await BookstoreBook.findAll({
    where: whereClause,
    include: includeClause,
    order: [["createdAt", "DESC"]],
  });
}

async function getBookById(id) {
  return await BookstoreBook.findOne({
    where: { id, isActive: true },
    include: [
      {
        model: BookstoreCategory,
        as: "categories",
        where: { isActive: true },
        required: false,
        through: { attributes: [] },
      },
    ],
  });
}

async function getFeaturedBooks() {
  return await BookstoreBook.findAll({
    where: { isActive: true, isFeatured: true },
    include: [
      {
        model: BookstoreCategory,
        as: "categories",
        where: { isActive: true },
        required: false,
        through: { attributes: [] },
      },
    ],
    order: [["createdAt", "DESC"]],
    limit: 10,
  });
}

async function getBooksByCategory(categoryId) {
  return await BookstoreBook.findAll({
    where: { isActive: true },
    include: [
      {
        model: BookstoreCategory,
        as: "categories",
        where: { id: categoryId, isActive: true },
        required: true,
        through: { attributes: [] },
      },
    ],
    order: [["createdAt", "DESC"]],
  });
}

async function updateBook(id, updateData) {
  const [updatedRowsCount] = await BookstoreBook.update(updateData, {
    where: { id },
  });

  if (updatedRowsCount === 0) {
    throw new Error("Book not found");
  }

  return await getBookById(id);
}

async function deleteBook(id) {
  const deletedRowsCount = await BookstoreBook.destroy({
    where: { id },
  });

  if (deletedRowsCount === 0) {
    throw new Error("Book not found");
  }

  return true;
}

async function assignCategoriesToBook(bookId, categoryIds) {
  // Remove existing categories
  await BookstoreBookCategory.destroy({
    where: { bookId },
  });

  // Add new categories
  const bookCategories = categoryIds.map((categoryId) => ({
    bookId,
    categoryId,
  }));

  return await BookstoreBookCategory.bulkCreate(bookCategories);
}

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createBook,
  getAllBooks,
  getBookById,
  getFeaturedBooks,
  getBooksByCategory,
  updateBook,
  deleteBook,
  assignCategoriesToBook,
};