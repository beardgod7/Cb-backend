const { Payment, TransferNotice, PaymentSettings } = require("./model");

async function createPayment(paymentData) {
  return await Payment.create(paymentData);
}

async function getPaymentByReference(reference) {
  return await Payment.findOne({ where: { transactionReference: reference } });
}

async function updatePaymentStatus(reference, status, metadata = {}) {
  const payment = await Payment.findOne({ where: { transactionReference: reference } });
  if (!payment) throw new Error("Payment not found");

  const patch = {
    status,
    metadata: { ...payment.metadata, ...metadata },
  };
  if (status === "success" && !payment.paidAt) patch.paidAt = new Date();

  return await payment.update(patch);
}

async function getPaymentsByUser(userId) {
  return await Payment.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
}

async function getAllPayments() {
  return await Payment.findAll({ order: [["createdAt", "DESC"]] });
}

async function getPaymentsByBooking(bookingType, bookingId) {
  return await Payment.findAll({ where: { bookingType, bookingId } });
}

async function getPaymentStats() {
  const total = await Payment.count();
  const successful = await Payment.count({ where: { status: "success" } });
  const pending = await Payment.count({ where: { status: "pending" } });
  const failed = await Payment.count({ where: { status: "failed" } });
  return { total, successful, pending, failed };
}

// ===== Transfer notices =====
async function createTransferNotice(data) {
  return TransferNotice.create(data);
}
async function getTransferNoticesByUser(userId) {
  return TransferNotice.findAll({ where: { userId }, order: [["createdAt", "DESC"]] });
}
async function listTransferNotices(status) {
  const where = {};
  if (status) where.status = status;
  return TransferNotice.findAll({ where, order: [["createdAt", "DESC"]] });
}
async function getTransferNoticeById(id) {
  return TransferNotice.findByPk(id);
}

// ===== Settings =====
async function getPaymentSettings() {
  let settings = await PaymentSettings.findByPk(1);
  if (!settings) {
    settings = await PaymentSettings.create({
      id: 1,
      accountName: process.env.BANK_ACCOUNT_NAME || "CBAAC",
      bankName: process.env.BANK_NAME || "GTBank",
      accountNumber: process.env.BANK_ACCOUNT_NUMBER || "0000000000",
    });
  }
  return settings;
}

module.exports = {
  createPayment,
  getPaymentByReference,
  updatePaymentStatus,
  getPaymentsByUser,
  getAllPayments,
  getPaymentsByBooking,
  getPaymentStats,
  createTransferNotice,
  getTransferNoticesByUser,
  listTransferNotices,
  getTransferNoticeById,
  getPaymentSettings,
};
