const { Payment } = require("./model");

async function createPayment(paymentData) {
  return await Payment.create(paymentData);
}

async function getPaymentByReference(reference) {
  return await Payment.findOne({ where: { transactionReference: reference } });
}

async function updatePaymentStatus(reference, status, metadata = {}) {
  const payment = await Payment.findOne({ where: { transactionReference: reference } });
  if (!payment) throw new Error("Payment not found");
  
  return await payment.update({
    status,
    metadata: { ...payment.metadata, ...metadata },
  });
}

async function getPaymentsByUser(userId) {
  return await Payment.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
  });
}

async function getAllPayments() {
  return await Payment.findAll({
    order: [["createdAt", "DESC"]],
  });
}

async function getPaymentsByBooking(bookingType, bookingId) {
  return await Payment.findAll({
    where: { bookingType, bookingId },
  });
}

async function getPaymentStats() {
  const total = await Payment.count();
  const successful = await Payment.count({ where: { status: "success" } });
  const pending = await Payment.count({ where: { status: "pending" } });
  const failed = await Payment.count({ where: { status: "failed" } });

  return { total, successful, pending, failed };
}

module.exports = {
  createPayment,
  getPaymentByReference,
  updatePaymentStatus,
  getPaymentsByUser,
  getAllPayments,
  getPaymentsByBooking,
  getPaymentStats,
};
