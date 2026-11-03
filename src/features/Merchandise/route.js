const express = require("express");
const router = express.Router();
const c = require("./controller");
const { authenticate } = require("../../middleware/authmiddleware");
const { authorize } = require("../../middleware/rolemiddleware");

// ===== Public (mounted at /merchandise) =====
router.get("/merchandise/products", c.getProducts);
router.get("/merchandise/products/:slug", c.getProduct);
router.get("/merchandise/products/:slug/related", c.getRelatedProducts);
router.post("/merchandise/cart/quote", c.cartQuote);

// ===== Customer orders (mounted at /orders) =====
router.post("/orders", authenticate(), c.createOrder);
router.get("/orders/me", authenticate(), c.getMyOrders);
router.get("/orders/:id", authenticate(), c.getOrder);
router.patch("/orders/:id/cancel", authenticate(), c.cancelOrder);

// ===== Admin =====
const admin = authorize(["Admin", "SuperAdmin"]);
router.get("/admin/merchandise/products", admin, c.adminListProducts);
router.post("/admin/merchandise/products", admin, c.adminCreateProduct);
router.put("/admin/merchandise/products/:id", admin, c.adminUpdateProduct);
router.patch("/admin/merchandise/products/:id/stock", admin, c.adminAdjustStock);
router.delete("/admin/merchandise/products/:id", admin, c.adminDeleteProduct);
router.get("/admin/orders", admin, c.adminListOrders);
router.patch("/admin/orders/:id/status", admin, c.adminUpdateOrderStatus);
router.get("/admin/orders/export", admin, c.adminExportOrders);
router.get("/admin/merchandise/settings", admin, c.adminGetSettings);
router.put("/admin/merchandise/settings", admin, c.adminUpdateSettings);

module.exports = router;
