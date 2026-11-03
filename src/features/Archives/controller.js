const repository = require("./repository");
const {
  collectionSchema,
  subcategorySchema,
  itemSchema,
  updateItemSchema,
  pagesSchema,
} = require("./schema");
const { ok, AppError } = require("../../utils/apiResponse");
const { getPagination, buildListResponse } = require("../../utils/pagination");

function slugify(s) {
  return String(s)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function itemCard(item) {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    year: item.year,
    typeLabel: item.typeLabel,
    collection: item.collection
      ? { slug: item.collection.slug, title: item.collection.title, itemKind: item.collection.itemKind }
      : undefined,
    subcategory: item.subcategory
      ? { slug: item.subcategory.slug, title: item.subcategory.title }
      : undefined,
    thumbnail: item.thumbnail,
    summary: item.summary,
    place: item.place,
  };
}

function itemDetail(item) {
  const base = itemCard(item);
  const kind = item.collection ? item.collection.itemKind : "document";
  if (kind === "document") {
    return {
      ...base,
      authors: item.authors || [],
      abstract: item.abstract,
      tableOfContents: item.tableOfContents || [],
      pageCount: item.pageCount,
      previewPageLimit: item.previewPageLimit,
      // pages are NOT included; served via /pages with the preview limit
    };
  }
  if (kind === "photoSet") {
    return {
      ...base,
      photos: item.photos || [],
      location: item.location,
      eventDate: item.eventDate,
    };
  }
  // idCard
  return {
    ...base,
    participantName: item.participantName,
    country: item.country,
    role: item.role,
    cardNumber: item.cardNumber,
    photoUrl: item.photoUrl,
    cardScanUrl: item.cardScanUrl,
  };
}

// ===== Public =====
async function getCollections(req, res, next) {
  try {
    const collections = await repository.listCollections();
    const data = [];
    for (const col of collections) {
      const subs = [];
      for (const s of col.subcategories || []) {
        subs.push({
          id: s.id,
          slug: s.slug,
          title: s.title,
          itemCount: await repository.countItemsForSubcategory(s.id),
        });
      }
      data.push({
        id: col.id,
        slug: col.slug,
        title: col.title,
        description: col.description,
        itemKind: col.itemKind,
        coverImage: col.coverImage,
        subcategories: subs.sort((a, b) => 0),
      });
    }
    return ok(res, { message: "Collections", data });
  } catch (err) {
    next(err);
  }
}

async function getCollection(req, res, next) {
  try {
    const perSub = Math.min(parseInt(req.query.perSubcategory, 10) || 3, 24);
    const col = await repository.getCollectionBySlug(req.params.slug);
    if (!col) throw new AppError("NOT_FOUND", "Collection not found", 404);

    const subcategories = [];
    for (const s of (col.subcategories || []).sort((a, b) => a.order - b.order)) {
      const items = await repository.firstItemsForSubcategory(s.id, perSub);
      subcategories.push({
        id: s.id,
        slug: s.slug,
        title: s.title,
        items: items.map(itemCard),
      });
    }

    return ok(res, {
      message: "Collection",
      data: {
        id: col.id,
        slug: col.slug,
        title: col.title,
        description: col.description,
        itemKind: col.itemKind,
        coverImage: col.coverImage,
        subcategories,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getItems(req, res, next) {
  try {
    const { page, limit, offset } = getPagination(req.query, { defaultLimit: 9, maxLimit: 48 });
    const { rows, count } = await repository.listItems({
      collectionSlug: req.query.collection,
      subcategorySlug: req.query.subcategory,
      search: req.query.search,
      year: req.query.year,
      sort: req.query.sort,
      offset,
      limit,
    });
    return ok(res, {
      message: "Items",
      data: buildListResponse(rows.map(itemCard), count, page, limit),
    });
  } catch (err) {
    next(err);
  }
}

async function getItem(req, res, next) {
  try {
    const item = await repository.getItemBySlug(req.params.slug);
    if (!item) throw new AppError("NOT_FOUND", "Item not found", 404);
    return ok(res, { message: "Item", data: itemDetail(item) });
  } catch (err) {
    next(err);
  }
}

async function getItemPage(req, res, next) {
  try {
    const item = await repository.getItemBySlug(req.params.slug);
    if (!item) throw new AppError("NOT_FOUND", "Item not found", 404);

    const n = parseInt(req.query.page, 10) || 1;
    if (n < 1 || n > item.pageCount) {
      throw new AppError("PAGE_NOT_FOUND", "Page not found", 404);
    }
    if (n > item.previewPageLimit) {
      throw new AppError(
        "PREVIEW_LIMIT_REACHED",
        "Schedule a visit to read the full document",
        403,
        { data: { previewPageLimit: item.previewPageLimit, pageCount: item.pageCount } }
      );
    }

    const page = await repository.getPage(item.id, n);
    return ok(res, {
      message: "Page",
      data: {
        pageNumber: n,
        pageCount: item.pageCount,
        previewPageLimit: item.previewPageLimit,
        isLastPreviewPage: n === Math.min(item.previewPageLimit, item.pageCount),
        heading: page ? page.heading : null,
        body: page ? page.body : null,
        imageUrl: page ? page.imageUrl : null,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ===== Admin =====
async function adminCreateCollection(req, res, next) {
  try {
    const data = await collectionSchema.validateAsync(req.body);
    if (!data.slug) data.slug = slugify(data.title);
    const col = await repository.createCollection(data);
    return ok(res, { status: 201, message: "Collection created", data: col });
  } catch (err) {
    next(err);
  }
}
async function adminUpdateCollection(req, res, next) {
  try {
    const col = await repository.updateCollection(req.params.id, req.body);
    if (!col) throw new AppError("NOT_FOUND", "Collection not found", 404);
    return ok(res, { message: "Collection updated", data: col });
  } catch (err) {
    next(err);
  }
}
async function adminDeleteCollection(req, res, next) {
  try {
    await repository.deleteCollection(req.params.id);
    return ok(res, { message: "Collection deleted" });
  } catch (err) {
    next(err);
  }
}

async function adminCreateSubcategory(req, res, next) {
  try {
    const data = await subcategorySchema.validateAsync(req.body);
    if (!data.slug) data.slug = slugify(data.title);
    const sub = await repository.createSubcategory(data);
    return ok(res, { status: 201, message: "Subcategory created", data: sub });
  } catch (err) {
    next(err);
  }
}
async function adminUpdateSubcategory(req, res, next) {
  try {
    const sub = await repository.updateSubcategory(req.params.id, req.body);
    if (!sub) throw new AppError("NOT_FOUND", "Subcategory not found", 404);
    return ok(res, { message: "Subcategory updated", data: sub });
  } catch (err) {
    next(err);
  }
}
async function adminDeleteSubcategory(req, res, next) {
  try {
    await repository.deleteSubcategory(req.params.id);
    return ok(res, { message: "Subcategory deleted" });
  } catch (err) {
    next(err);
  }
}

async function adminListItems(req, res, next) {
  try {
    const { page, limit, offset } = getPagination(req.query, { defaultLimit: 20, maxLimit: 100 });
    const { rows, count } = await repository.listItems({
      collectionSlug: req.query.collection,
      subcategorySlug: req.query.subcategory,
      search: req.query.search,
      year: req.query.year,
      sort: req.query.sort,
      offset,
      limit,
      includeUnpublished: true,
    });
    return ok(res, { message: "Items", data: buildListResponse(rows, count, page, limit) });
  } catch (err) {
    next(err);
  }
}

async function adminCreateItem(req, res, next) {
  try {
    const data = await itemSchema.validateAsync(req.body);
    if (!data.slug) data.slug = `${slugify(data.title)}-${Date.now().toString(36)}`;
    if (data.subcategoryId === "") data.subcategoryId = null;
    const item = await repository.createItem(data);
    return ok(res, { status: 201, message: "Item created", data: itemDetail(item) });
  } catch (err) {
    next(err);
  }
}

async function adminUpdateItem(req, res, next) {
  try {
    const data = await updateItemSchema.validateAsync(req.body);
    const item = await repository.updateItem(req.params.id, data);
    if (!item) throw new AppError("NOT_FOUND", "Item not found", 404);
    return ok(res, { message: "Item updated", data: itemDetail(item) });
  } catch (err) {
    next(err);
  }
}

async function adminPublishItem(req, res, next) {
  try {
    const item = await repository.updateItem(req.params.id, { isPublished: !!req.body.isPublished });
    if (!item) throw new AppError("NOT_FOUND", "Item not found", 404);
    return ok(res, { message: "Item publish state updated", data: { id: item.id, isPublished: item.isPublished } });
  } catch (err) {
    next(err);
  }
}

async function adminDeleteItem(req, res, next) {
  try {
    const okDel = await repository.deleteItem(req.params.id);
    if (!okDel) throw new AppError("NOT_FOUND", "Item not found", 404);
    return ok(res, { message: "Item deleted" });
  } catch (err) {
    next(err);
  }
}

async function adminUploadPages(req, res, next) {
  try {
    const { pages } = await pagesSchema.validateAsync(req.body);
    const item = await repository.getItemById(req.params.id);
    if (!item) throw new AppError("NOT_FOUND", "Item not found", 404);
    const pageCount = await repository.upsertPages(item.id, pages);
    return ok(res, { message: "Pages uploaded", data: { pageCount } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCollections,
  getCollection,
  getItems,
  getItem,
  getItemPage,
  adminCreateCollection,
  adminUpdateCollection,
  adminDeleteCollection,
  adminCreateSubcategory,
  adminUpdateSubcategory,
  adminDeleteSubcategory,
  adminListItems,
  adminCreateItem,
  adminUpdateItem,
  adminPublishItem,
  adminDeleteItem,
  adminUploadPages,
};
