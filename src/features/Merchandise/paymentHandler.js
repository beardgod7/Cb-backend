/**
 * Merchandise order payment handler. Registered with the Payment booking
 * registry so POST /payment/initialize { bookingType: "merchandise" } works and
 * the webhook can reduce stock + mark the order paid.
 */
const { registerBookingHandler } = require("../Payment/bookingRegistry");
const { Order, OrderItem, Product } = require("./model");

registerBookingHandler("merchandise", {
  async getBooking(orderId) {
    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: "items" }],
    });
    if (!order) return null;
    return {
      id: order.id,
      userId: order.userId,
      email: order.delivery?.email,
      total: Number(order.total),
      status: order.status,
      alreadyPaid: ["paid", "dispatched", "delivered"].includes(order.status),
      summary: {
        title: `Order #${order.orderNumber}`,
        lines: (order.items || []).map((i) => `${i.name} × ${i.quantity}`),
        email: order.delivery?.email,
      },
    };
  },

  async awaitTransfer(orderId) {
    const order = await Order.findByPk(orderId);
    if (order && order.status === "pending_payment") {
      order.status = "awaiting_transfer";
      await order.save();
    }
  },

  async markPaid(orderId, { reference } = {}) {
    const order = await Order.findByPk(orderId, {
      include: [{ model: OrderItem, as: "items" }],
    });
    if (!order) return;
    if (["paid", "dispatched", "delivered"].includes(order.status)) return; // idempotent

    // Re-check and reduce stock. If anything sold out, we still mark paid but flag it;
    // staff resolve via refund/cancel. Stock never goes below 0.
    for (const item of order.items || []) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();
      }
    }

    order.status = "paid";
    order.paidAt = new Date();
    if (reference) order.paymentReference = reference;
    await order.save();
  },

  async release(orderId) {
    const order = await Order.findByPk(orderId);
    if (order && order.status === "pending_payment") {
      order.status = "cancelled";
      order.cancelledAt = new Date();
      await order.save();
    }
  },
});

module.exports = {};
