const { Op } = require("sequelize");
const {
  ArchiveCollection,
  ArchiveSubcategory,
  ArchiveItem,
  ArchivePage,
} = require("./model");

// ===== Collections =====
async function listCollections({ includeUnpublished } = {}) {
  const where = {};
  if (!includeUnpublished) where.isPublished = true;
  return ArchiveCollection.findAll({
    where,
    order: [["order", "ASC"]],
    include: [{ model: ArchiveSubcategory, as: "subcategories" }],
  });
}

async function getCollectionBySlug(slug, { includeUnpublished } = {}) {
  const where = { slug };
  if (!includeUnpublished) where.isPublished = true;
  return ArchiveCollection.findOne({
    where,
    include: [{ model: ArchiveSubcategory, as: "subcategories" }],
  });
}

async function createCollection(data) {
  return ArchiveCollection.create(data);
}
async function updateCollection(id, data) {
  const c = await ArchiveCollection.findByPk(id);
  if (!c) return null;
  Object.assign(c, data);
  await c.save();
  return c;
}
async function deleteCollection(id) {
  return ArchiveCollection.destroy({ where: { id } });
}

// ===== Subcategories =====
async function createSubcategory(data) {
  return ArchiveSubcategory.create(data);
}
async function updateSubcategory(id, data) {
  const s = await ArchiveSubcategory.findByPk(id);
  if (!s) return null;
  Object.assign(s, data);
  await s.save();
  return s;
}
async function deleteSubcategory(id) {
  return ArchiveSubcategory.destroy({ where: { id } });
}

async function countItemsForSubcategory(subcategoryId) {
  return ArchiveItem.count({ where: { subcategoryId, isPublished: true } });
}

// ===== Items =====
async function listItems({
  collectionSlug,
  subcategorySlug,
  search,
  year,
  sort,
  offset,
  limit,
  includeUnpublished,
}) {
  const where = {};
  if (!includeUnpublished) where.isPublished = true;
  if (year) where.year = parseInt(year, 10);

  const include = [
    { model: ArchiveCollection, as: "collection" },
    { model: ArchiveSubcategory, as: "subcategory" },
  ];

  if (collectionSlug) {
    include[0].where = { slug: collectionSlug };
    include[0].required = true;
  }
  if (subcategorySlug) {
    include[1].where = { slug: subcategorySlug };
    include[1].required = true;
  }

  if (search) {
    const q = `%${search}%`;
    where[Op.or] = [
      { title: { [Op.iLike]: q } },
      { summary: { [Op.iLike]: q } },
      { participantName: { [Op.iLike]: q } },
      { country: { [Op.iLike]: q } },
      { tags: { [Op.overlap]: [search] } },
    ];
  }

  let order = [["createdAt", "DESC"]];
  if (sort === "title") order = [["title", "ASC"]];
  else if (sort === "newest") order = [["createdAt", "DESC"]];

  return ArchiveItem.findAndCountAll({ where, include, order, offset, limit, distinct: true });
}

async function getItemBySlug(slug, { includeUnpublished } = {}) {
  const where = { slug };
  if (!includeUnpublished) where.isPublished = true;
  return ArchiveItem.findOne({
    where,
    include: [
      { model: ArchiveCollection, as: "collection" },
      { model: ArchiveSubcategory, as: "subcategory" },
    ],
  });
}

async function getItemById(id) {
  return ArchiveItem.findByPk(id);
}

async function firstItemsForSubcategory(subcategoryId, limit) {
  return ArchiveItem.findAll({
    where: { subcategoryId, isPublished: true },
    include: [
      { model: ArchiveCollection, as: "collection" },
      { model: ArchiveSubcategory, as: "subcategory" },
    ],
    order: [["createdAt", "DESC"]],
    limit,
  });
}

async function createItem(data) {
  return ArchiveItem.create(data);
}
async function updateItem(id, data) {
  const i = await ArchiveItem.findByPk(id);
  if (!i) return null;
  Object.assign(i, data);
  await i.save();
  return i;
}
async function deleteItem(id) {
  const i = await ArchiveItem.findByPk(id);
  if (!i) return false;
  i.isPublished = false;
  await i.save();
  return true;
}

// ===== Pages =====
async function getPage(itemId, pageNumber) {
  return ArchivePage.findOne({ where: { itemId, pageNumber } });
}
async function upsertPages(itemId, pages) {
  await ArchivePage.destroy({ where: { itemId } });
  const rows = pages.map((p) => ({ ...p, itemId }));
  await ArchivePage.bulkCreate(rows);
  const max = pages.reduce((m, p) => Math.max(m, p.pageNumber), 0);
  await ArchiveItem.update({ pageCount: max }, { where: { id: itemId } });
  return max;
}

module.exports = {
  listCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  countItemsForSubcategory,
  listItems,
  getItemBySlug,
  getItemById,
  firstItemsForSubcategory,
  createItem,
  updateItem,
  deleteItem,
  getPage,
  upsertPages,
};
