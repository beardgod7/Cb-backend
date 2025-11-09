const { Category, Book, BookCategory, ReadingVisit, LibrarianContact } = require("./model");
const { Op } = require("sequelize");

// ==================
// Categories
// ==================

async function createCategory(categoryData) {
  return await Category.create(categoryData);
}

async function getAllCategories() {
  return await Category.findAll({
    where: { isActive: true },
    order: [["name", "ASC"]],
  });
}

async function getCategoryById(id) {
  return await Category.findByPk(id);
}

async function updateCategory(id, updateData) {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("Category not found");
  return await category.update(updateData);
}

async function deleteCategory(id) {
  const category = await Category.findByPk(id);
  if (!category) throw new Error("Category not found");
  await category.destroy();
  return true;
}

// ==================
// Books
// ==================

async function createBook(bookData) {
  return await Book.create(bookData);
}

async function getAllBooks(filter = {}) {
  const where = { isActive: true };

  if (filter.categoryId) {
    // Will be handled with join
  }

  if (filter.featured) {
    where.isFeatured = true;
  }

  if (filter.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${filter.search}%` } },
      { author: { [Op.iLike]: `%${filter.search}%` } },
      { description: { [Op.iLike]: `%${filter.search}%` } },
    ];
  }

  const options = {
    where,
    include: [
      {
        model: Category,
        through: { attributes: [] },
        where: filter.categoryId ? { id: filter.categoryId } : undefined,
      },
    ],
    order: [["createdAt", "DESC"]],
  };

  return await Book.findAll(options);
}

async function getBookById(id) {
  return await Book.findByPk(id, {
    include: [
      {
        model: Category,
        through: { attributes: [] },
      },
    ],
  });
}

async function updateBook(id, updateData) {
  const book = await Book.findByPk(id);
  if (!book) throw new Error("Book not found");
  return await book.update(updateData);
}

async function deleteBook(id) {
  const book = await Book.findByPk(id);
  if (!book) throw new Error("Book not found");
  await book.destroy();
  return true;
}

async function getFeaturedBooks() {
  return await Book.findAll({
    where: { isActive: true, isFeatured: true },
    include: [
      {
        model: Category,
        through: { attributes: [] },
      },
    ],
    limit: 10,
  });
}

// ==================
// Book Categories
// ==================

async function assignCategoriesToBook(bookId, categoryIds) {
  // Remove existing categories
  await BookCategory.destroy({ where: { bookId } });

  // Add new categories
  const bookCategories = categoryIds.map((categoryId) => ({
    bookId,
    categoryId,
  }));

  return await BookCategory.bulkCreate(bookCategories);
}

async function getBooksByCategory(categoryId) {
  return await Book.findAll({
    where: { isActive: true },
    include: [
      {
        model: Category,
        where: { id: categoryId },
        through: { attributes: [] },
      },
    ],
  });
}

// ==================
// Reading Visits
// ==================

async function createReadingVisit(visitData) {
  return await ReadingVisit.create(visitData);
}

async function getAllReadingVisits() {
  return await ReadingVisit.findAll({
    include: [
      {
        model: Book,
        attributes: ["id", "title", "author"],
      },
    ],
    order: [["preferredDate", "ASC"]],
  });
}

async function getReadingVisitById(id) {
  return await ReadingVisit.findByPk(id, {
    include: [
      {
        model: Book,
        attributes: ["id", "title", "author"],
      },
    ],
  });
}

async function updateReadingVisitStatus(id, status, adminNotes = null) {
  const visit = await ReadingVisit.findByPk(id);
  if (!visit) throw new Error("Reading visit not found");
  return await visit.update({ status, adminNotes });
}

async function getReadingVisitsByUser(userId) {
  return await ReadingVisit.findAll({
    where: { userId },
    include: [
      {
        model: Book,
        attributes: ["id", "title", "author", "coverImage"],
      },
    ],
    order: [["preferredDate", "DESC"]],
  });
}

// ==================
// Librarian Contacts
// ==================

async function createLibrarianContact(contactData) {
  return await LibrarianContact.create(contactData);
}

async function getAllLibrarianContacts() {
  return await LibrarianContact.findAll({
    order: [["createdAt", "DESC"]],
  });
}

async function getLibrarianContactById(id) {
  return await LibrarianContact.findByPk(id);
}

async function updateLibrarianContactStatus(id, status, adminResponse = null) {
  const contact = await LibrarianContact.findByPk(id);
  if (!contact) throw new Error("Contact not found");
  return await contact.update({ status, adminResponse });
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
  updateBook,
  deleteBook,
  getFeaturedBooks,
  assignCategoriesToBook,
  getBooksByCategory,
  createReadingVisit,
  getAllReadingVisits,
  getReadingVisitById,
  updateReadingVisitStatus,
  getReadingVisitsByUser,
  createLibrarianContact,
  getAllLibrarianContacts,
  getLibrarianContactById,
  updateLibrarianContactStatus,
};
