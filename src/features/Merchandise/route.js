const express = require("express");
const router = express.Router();
const c = require("./controller");
const { authenticate } = require("../../middleware/authmiddleware");
const { authorize } = require("../../middleware/rolemiddleware");

/**
 * @swagger
 * /admin/merchandise/products/{id}:
 *   get:
 *     summary: Get a single product by ID (Admin only)
 *     tags: [Merchandise Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Product retrieved
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update a product (Admin only)
 *     tags: [Merchandise Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name (optional)
 *               category:
 *                 type: string
 *                 enum: [artworks, cultural]
 *                 description: Product category (optional)
 *               price:
 *                 type: integer
 *                 minimum: 0
 *                 description: Product price in cents (optional)
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 description: Product stock quantity (optional)
 *               description:
 *                 type: string
 *                 description: Product description (optional)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Product images (optional)
 *               isFeatured:
 *                 type: boolean
 *                 description: Feature this product (optional)
 *               isActive:
 *                 type: boolean
 *                 description: Product active status (optional)
 *               sortOrder:
 *                 type: integer
 *                 description: Display sort order (optional)
 *     responses:
 *       200:
 *         description: Product updated
 *       404:
 *         description: Product not found
 *       400:
 *         description: Validation error
 */

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
router.get("/admin/merchandise/products/:id", admin, c.adminGetProduct);
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
