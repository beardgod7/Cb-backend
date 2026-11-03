const { Op } = require("sequelize");
const { VisitRequest, VisitSettings } = require("./model");

async function getSettings() {
  let s = await VisitSettings.findByPk(1);
  if (!s) s = await VisitSettings.create({ id: 1 });
  return s;
}

async function updateSettings(data) {
  const s = await getSettings();
  Object.assign(s, data);
  await s.save();
  return s;
}

// Count active (pending/approved) visits for a given date.
async function countForDate(dateStr) {
  return VisitRequest.count({
    where: { visitDate: dateStr, status: { [Op.in]: ["pending", "approved"] } },
  });
}

// Count active visits per date within a range -> { "YYYY-MM-DD": n }
async function countsInRange(from, to) {
  const rows = await VisitRequest.findAll({
    where: {
      visitDate: { [Op.between]: [from, to] },
      status: { [Op.in]: ["pending", "approved"] },
    },
  });
  const map = {};
  for (const r of rows) {
    map[r.visitDate] = (map[r.visitDate] || 0) + 1;
  }
  return map;
}

async function hasActiveVisitOnDate(userId, dateStr) {
  const existing = await VisitRequest.findOne({
    where: { userId, visitDate: dateStr, status: { [Op.in]: ["pending", "approved"] } },
  });
  return !!existing;
}

async function create(data) {
  return VisitRequest.create(data);
}

async function findById(id) {
  return VisitRequest.findByPk(id);
}

async function listByUser(userId) {
  return VisitRequest.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
}

async function listAdmin({ status, resourceType, from, to, offset, limit }) {
  const where = {};
  if (status) where.status = status;
  if (resourceType) where.resourceType = resourceType;
  if (from || to) {
    where.visitDate = {};
    if (from) where.visitDate[Op.gte] = from;
    if (to) where.visitDate[Op.lte] = to;
  }
  return VisitRequest.findAndCountAll({
    where,
    order: [["visitDate", "ASC"], ["createdAt", "DESC"]],
    offset,
    limit,
  });
}

module.exports = {
  getSettings,
  updateSettings,
  countForDate,
  countsInRange,
  hasActiveVisitOnDate,
  create,
  findById,
  listByUser,
  listAdmin,
};
