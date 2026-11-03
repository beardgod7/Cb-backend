const { Op } = require("sequelize");
const { Product, Order, OrderItem, ShopSettings } = require("./model");

// ===== Products =====
async function listProducts({ category, featured, includeInactive, offset, limit }) {
  const where = {};
  if (!includeInactive) where.isActive = true;
  if (category) where.category = category;
  if (featured) where.isFeatured = true;
  return Product.findAndCountAll({
    where,
    order: [["sortOrder", "ASC"], ["createdAt", "DESC"]],
    offset,
    limit,
  });
}

async function getProductBySlug(slug) {
  return Product.findOne({ where: { slug, isActive: true } });
}

async function getProductById(id, { includeInactive } = {}) {
  const where = { id };
  if (!includeInactive) where.isActive = true;
  return Product.findOne({ where });
}

async function getRelated(product, limit) {
  return Product.findAll({
    where: {
      isActive: true,
      category: product.category,
      id: { [Op.ne]: product.id },
    },
    order: [["sortOrder", "ASC"]],
    limit,
  });
}

async function createProduct(data) {
  return Product.create(data);
}
async function updateProduct(id, data) {
  const p = await Product.findByPk(id);
  if (!p) return null;
  Object.assign(p, data);
  await p.save();
  return p;
}
async function softDeleteProduct(id) {
  const p = await Product.findByPk(id);
  if (!p) return false;
  p.isActive = false;
  await p.save();
  return true;
}
async function listAllProducts() {
  return Product.findAll({ order: [["sortOrder", "ASC"], ["createdAt", "DESC"]] });
}

// ===== Orders =====
async function createOrder(data, items) {
  const order = await Order.create(data);
  const rows = items.map((i) => ({ ...i, orderId: order.id }));
  await OrderItem.bulkCreate(rows);
  return order;
}

async function getOrderById(id) {
  return Order.findByPk(id, { include: [{ model: OrderItem, as: "items" }] });
}

async function listOrdersByUser({ userId, status, search, offset, limit }) {
  const where = { userId };
  if (status) where.status = status;
  const include = [{ model: OrderItem, as: "items" }];
  const result = await Order.findAndCountAll({
    where,
    include,
    order: [["createdAt", "DESC"]],
    offset,
    limit,
    distinct: true,
  });
  if (search) {
    const q = search.toLowerCase();
    result.rows = result.rows.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        (o.items || []).some((it) => it.name.toLowerCase().includes(q))
    );
  }
  return result;
}

async function listOrdersAdmin({ status, search, from, to }) {
  const where = {};
  if (status) where.status = status;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt[Op.gte] = new Date(from);
    if (to) where.createdAt[Op.lte] = new Date(to);
  }
  let rows = await Order.findAll({
    where,
    include: [{ model: OrderItem, as: "items" }],
    order: [["createdAt", "DESC"]],
  });
  if (search) {
    const q = search.toLowerCase();
    rows = rows.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        (o.items || []).some((it) => it.name.toLowerCase().includes(q))
    );
  }
  return rows;
}

// ===== Settings =====
async function getSettings() {
  let s = await ShopSettings.findByPk(1);
  if (!s) s = await ShopSettings.create({ id: 1 });
  return s;
}
async function updateSettings(data) {
  const s = await getSettings();
  Object.assign(s, data);
  await s.save();
  return s;
}

module.exports = {
  listProducts,
  getProductBySlug,
  getProductById,
  getRelated,
  createProduct,
  updateProduct,
  softDeleteProduct,
  listAllProducts,
  createOrder,
  getOrderById,
  listOrdersByUser,
  listOrdersAdmin,
  getSettings,
  updateSettings,
};
