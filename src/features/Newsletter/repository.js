const { Op } = require("sequelize");
const { Subscriber } = require("./model");

async function findByEmail(email) {
  return Subscriber.findOne({
    where: { email: String(email || "").trim().toLowerCase() },
  });
}

async function findByConfirmToken(token) {
  return Subscriber.findOne({ where: { confirmToken: token } });
}

async function findByUnsubscribeToken(token) {
  return Subscriber.findOne({ where: { unsubscribeToken: token } });
}

async function create(data) {
  return Subscriber.create(data);
}

async function listSubscribers({ status, offset, limit } = {}) {
  const where = {};
  if (status) where.status = status;
  return Subscriber.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    offset,
    limit,
  });
}

async function listAllActive() {
  return Subscriber.findAll({
    where: { status: { [Op.ne]: "unsubscribed" } },
    order: [["createdAt", "DESC"]],
  });
}

module.exports = {
  findByEmail,
  findByConfirmToken,
  findByUnsubscribeToken,
  create,
  listSubscribers,
  listAllActive,
};
