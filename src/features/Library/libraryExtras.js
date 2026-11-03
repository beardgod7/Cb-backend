const { Op } = require("sequelize");
const { Book, Category, LibraryBookPage } = require("./model");
const { ok, AppError } = require("../../utils/apiResponse");
const { getPagination, buildListResponse } = require("../../utils/pagination");

// GET /library/books with paging, sort=newest, categoryIds=a,b,c, search
async function listBooks(req, res, next) {
  try {
    const { page, limit, offset } = getPagination(req.query, { defaultLimit: 12 });
    const where = { isActive: true };

    if (req.query.search) {
      const q = `%${req.query.search}%`;
      where[Op.or] = [
        { title: { [Op.iLike]: q } },
        { author: { [Op.iLike]: q } },
      ];
    }
    if (req.query.featured === "true") where.isFeatured = true;

    const include = [{ model: Category, through: { attributes: [] } }];
    if (req.query.categoryIds) {
      const ids = String(req.query.categoryIds).split(",").map((s) => s.trim()).filter(Boolean);
      if (ids.length) {
        include[0].where = { id: { [Op.in]: ids } };
        include[0].required = true;
      }
    }

    let order = [["createdAt", "DESC"]];
    if (req.query.sort === "newest") order = [["createdAt", "DESC"]];

    const { rows, count } = await Book.findAndCountAll({
      where,
      include,
      order,
      offset,
      limit,
      distinct: true,
    });

    return ok(res, {
      message: "Books retrieved successfully",
      data: buildListResponse(rows, count, page, limit),
    });
  } catch (err) {
    next(err);
  }
}

// GET /library/books/new-releases?limit=3
async function newReleases(req, res, next) {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 3, 20);
    const books = await Book.findAll({
      where: { isActive: true },
      order: [["createdAt", "DESC"]],
      limit,
    });
    return ok(res, { message: "New releases", data: books });
  } catch (err) {
    next(err);
  }
}

// GET /library/books/:id/related?limit=3
async function relatedBooks(req, res, next) {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) throw new AppError("RESOURCE_NOT_FOUND", "Book not found", 404);
    const limit = Math.min(parseInt(req.query.limit, 10) || 3, 12);
    const related = await Book.findAll({
      where: { isActive: true, id: { [Op.ne]: book.id } },
      order: [["createdAt", "DESC"]],
      limit,
    });
    return ok(res, { message: "Related books", data: related });
  } catch (err) {
    next(err);
  }
}

// GET /library/books/:id/pages?page=n  (server-side preview limit)
async function getPage(req, res, next) {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book || !book.isActive) throw new AppError("RESOURCE_NOT_FOUND", "Book not found", 404);

    const n = parseInt(req.query.page, 10) || 1;
    if (n < 1 || (book.pageCount && n > book.pageCount)) {
      throw new AppError("PAGE_NOT_FOUND", "Page not found", 404);
    }
    if (n > book.previewPageLimit) {
      throw new AppError("PREVIEW_LIMIT_REACHED", "Schedule a visit to read the full book", 403, {
        data: { previewPageLimit: book.previewPageLimit, pageCount: book.pageCount },
      });
    }

    const page = await LibraryBookPage.findOne({ where: { bookId: book.id, pageNumber: n } });
    return ok(res, {
      message: "Page",
      data: {
        pageNumber: n,
        pageCount: book.pageCount,
        previewPageLimit: book.previewPageLimit,
        heading: page ? page.heading : null,
        body: page ? page.body : null,
        imageUrl: page ? page.imageUrl : null,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /library/admin/books/:id/pages  { pages:[{pageNumber,heading,body,imageUrl}] }
async function adminUploadPages(req, res, next) {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) throw new AppError("RESOURCE_NOT_FOUND", "Book not found", 404);
    const pages = req.body.pages;
    if (!Array.isArray(pages) || !pages.length) {
      throw new AppError("BAD_REQUEST", "pages array is required", 400);
    }
    await LibraryBookPage.destroy({ where: { bookId: book.id } });
    await LibraryBookPage.bulkCreate(pages.map((p) => ({ ...p, bookId: book.id })));
    book.pageCount = pages.reduce((m, p) => Math.max(m, p.pageNumber || 0), 0);
    await book.save();
    return ok(res, { message: "Pages uploaded", data: { pageCount: book.pageCount } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listBooks,
  newReleases,
  relatedBooks,
  getPage,
  adminUploadPages,
};
