const crypto = require("crypto");
const { Op } = require("sequelize");
const {
  BookstoreBook,
  BookstoreCategory,
  BookPage,
  BookPurchase,
} = require("./model");
const { ok, AppError } = require("../../utils/apiResponse");
const { getPagination, buildListResponse } = require("../../utils/pagination");

function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function findBook(idOrSlug) {
  let book = null;
  // UUID-ish?
  if (/^[0-9a-f]{8}-/i.test(idOrSlug)) {
    book = await BookstoreBook.findOne({ where: { id: idOrSlug, isActive: true } });
  }
  if (!book) book = await BookstoreBook.findOne({ where: { slug: idOrSlug, isActive: true } });
  return book;
}

function bookPublic(book, { owned } = {}) {
  const b = book.toJSON ? book.toJSON() : book;
  delete b.fullFileKey; // never expose
  return {
    id: b.id,
    slug: b.slug,
    title: b.title,
    author: b.author,
    price: Number(b.price),
    shortDescription: b.shortDescription,
    longDescription: b.longDescription,
    numberOfChapters: b.numberOfChapters,
    numberOfPages: b.numberOfPages,
    numberOfParts: b.numberOfParts,
    editors: b.editors || [],
    publisher: b.publisher,
    coverPage: b.coverPage,
    pageCount: b.pageCount,
    previewPageLimit: b.previewPageLimit,
    isFeatured: b.isFeatured,
    categories: b.categories,
    owned: !!owned,
  };
}

// GET /bookstore/books/:idOrSlug  (enriched; owned flag when logged in)
async function getBookDetail(req, res, next) {
  try {
    const book = await findBook(req.params.idOrSlug);
    if (!book) throw new AppError("BOOK_NOT_FOUND", "Book not found", 404);

    const full = await BookstoreBook.findByPk(book.id, {
      include: [{ model: BookstoreCategory, as: "categories", through: { attributes: [] } }],
    });

    let owned = false;
    if (req.userId) {
      const purchase = await BookPurchase.findOne({
        where: { userId: req.userId, bookId: book.id, status: "paid" },
      });
      owned = !!purchase;
    }
    return ok(res, { message: "Book retrieved", data: bookPublic(full, { owned }) });
  } catch (err) {
    next(err);
  }
}

// GET /bookstore/books/:id/related
async function getRelated(req, res, next) {
  try {
    const book = await findBook(req.params.id);
    if (!book) throw new AppError("BOOK_NOT_FOUND", "Book not found", 404);
    const limit = Math.min(parseInt(req.query.limit, 10) || 4, 12);
    const related = await BookstoreBook.findAll({
      where: { isActive: true, id: { [Op.ne]: book.id } },
      order: [["createdAt", "DESC"]],
      limit,
    });
    return ok(res, { message: "Related books", data: related.map((b) => bookPublic(b)) });
  } catch (err) {
    next(err);
  }
}

// GET /bookstore/books/:id/pages?page=n
async function getBookPage(req, res, next) {
  try {
    const book = await findBook(req.params.id);
    if (!book) throw new AppError("BOOK_NOT_FOUND", "Book not found", 404);

    const n = parseInt(req.query.page, 10) || 1;
    if (n < 1 || (book.pageCount && n > book.pageCount)) {
      throw new AppError("PAGE_NOT_FOUND", "Page not found", 404);
    }

    // Owners can read all pages.
    let owned = false;
    if (req.userId) {
      owned = !!(await BookPurchase.findOne({
        where: { userId: req.userId, bookId: book.id, status: "paid" },
      }));
    }

    if (!owned && n > book.previewPageLimit) {
      throw new AppError("PREVIEW_LIMIT_REACHED", "Buy to keep reading", 403, {
        data: { previewPageLimit: book.previewPageLimit, pageCount: book.pageCount },
      });
    }

    const page = await BookPage.findOne({ where: { bookId: book.id, pageNumber: n } });
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

// POST /bookstore/purchases  { bookId }
async function createPurchase(req, res, next) {
  try {
    const { bookId } = req.body;
    if (!bookId) throw new AppError("BAD_REQUEST", "bookId is required", 400);
    const book = await BookstoreBook.findOne({ where: { id: bookId, isActive: true } });
    if (!book) throw new AppError("BOOK_NOT_FOUND", "Book not found", 404);

    // Already owned?
    const existingPaid = await BookPurchase.findOne({
      where: { userId: req.userId, bookId, status: "paid" },
    });
    if (existingPaid) {
      throw new AppError("ALREADY_OWNED", "You already own this book", 409, {
        data: { purchaseId: existingPaid.id },
      });
    }

    // Reuse a pending purchase if one exists.
    let purchase = await BookPurchase.findOne({
      where: { userId: req.userId, bookId, status: { [Op.in]: ["pending_payment", "awaiting_transfer"] } },
    });
    if (!purchase) {
      purchase = await BookPurchase.create({
        userId: req.userId,
        bookId,
        title: book.title,
        price: Math.round(Number(book.price)),
        status: "pending_payment",
      });
    }

    return ok(res, {
      status: 201,
      message: "Purchase created",
      data: { id: purchase.id, status: purchase.status, title: purchase.title, amount: purchase.price },
    });
  } catch (err) {
    next(err);
  }
}

// GET /bookstore/purchases/me
async function getMyPurchases(req, res, next) {
  try {
    const purchases = await BookPurchase.findAll({
      where: { userId: req.userId },
      order: [["createdAt", "DESC"]],
      include: [{ model: BookstoreBook, as: "book", attributes: ["id", "slug", "title", "coverPage"] }],
    });
    return ok(res, { message: "Your book purchases", data: purchases });
  } catch (err) {
    next(err);
  }
}

// GET /bookstore/purchases/:id/download
async function downloadPurchase(req, res, next) {
  try {
    const purchase = await BookPurchase.findByPk(req.params.id);
    if (!purchase || String(purchase.userId) !== String(req.userId)) {
      throw new AppError("NOT_FOUND", "Purchase not found", 404);
    }
    if (purchase.status !== "paid") {
      throw new AppError("NOT_PAID", "This book is not paid for yet", 403);
    }
    if (purchase.downloadCount >= 10) {
      throw new AppError("DOWNLOAD_LIMIT", "Download limit reached. Contact support.", 429);
    }

    const book = await BookstoreBook.findByPk(purchase.bookId);
    // Generate a short-lived signed-style URL. If a real storage signer is wired,
    // replace this with the provider's signed URL.
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const token = crypto.randomBytes(16).toString("hex");
    const url = book && book.fullFileKey
      ? `${book.fullFileKey}?signature=${token}&expires=${expiresAt.getTime()}`
      : null;

    if (!url) throw new AppError("NOT_FOUND", "The book file is not available yet", 404);

    purchase.downloadCount += 1;
    await purchase.save();

    return ok(res, { message: "Download link", data: { url, expiresAt: expiresAt.toISOString() } });
  } catch (err) {
    next(err);
  }
}

// ===== Admin: pages + file =====
async function adminUploadPages(req, res, next) {
  try {
    const book = await BookstoreBook.findByPk(req.params.id);
    if (!book) throw new AppError("BOOK_NOT_FOUND", "Book not found", 404);
    const pages = req.body.pages;
    if (!Array.isArray(pages) || !pages.length) {
      throw new AppError("BAD_REQUEST", "pages array is required", 400);
    }
    await BookPage.destroy({ where: { bookId: book.id } });
    await BookPage.bulkCreate(pages.map((p) => ({ ...p, bookId: book.id })));
    book.pageCount = pages.reduce((m, p) => Math.max(m, p.pageNumber || 0), 0);
    await book.save();
    return ok(res, { message: "Pages uploaded", data: { pageCount: book.pageCount } });
  } catch (err) {
    next(err);
  }
}

async function adminSetFile(req, res, next) {
  try {
    const book = await BookstoreBook.findByPk(req.params.id);
    if (!book) throw new AppError("BOOK_NOT_FOUND", "Book not found", 404);
    const { fullFileKey } = req.body;
    if (!fullFileKey) throw new AppError("BAD_REQUEST", "fullFileKey is required", 400);
    book.fullFileKey = fullFileKey;
    if (!book.slug) book.slug = `${slugify(book.title)}-${Date.now().toString(36)}`;
    await book.save();
    return ok(res, { message: "Book file set" });
  } catch (err) {
    next(err);
  }
}

async function adminListPurchases(req, res, next) {
  try {
    const where = {};
    if (req.query.from || req.query.to) {
      where.createdAt = {};
      if (req.query.from) where.createdAt[Op.gte] = new Date(req.query.from);
      if (req.query.to) where.createdAt[Op.lte] = new Date(req.query.to);
    }
    const purchases = await BookPurchase.findAll({ where, order: [["createdAt", "DESC"]] });
    return ok(res, { message: "Purchases", data: purchases });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getBookDetail,
  getRelated,
  getBookPage,
  createPurchase,
  getMyPurchases,
  downloadPurchase,
  adminUploadPages,
  adminSetFile,
  adminListPurchases,
};
