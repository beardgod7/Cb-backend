/**
 * @swagger
 * components:
 *   schemas:
 *     ProductImage:
 *       type: object
 *       properties:
 *         url: { type: string }
 *         thumbUrl: { type: string }
 *         width: { type: integer }
 *         height: { type: integer }
 *     ProductCard:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         slug: { type: string }
 *         name: { type: string }
 *         category: { type: string, enum: [artworks, cultural] }
 *         price: { type: integer, description: Naira }
 *         stock: { type: integer }
 *         image: { $ref: '#/components/schemas/ProductImage' }
 *     Order:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         orderNumber: { type: string }
 *         status: { type: string, enum: [pending_payment, awaiting_transfer, paid, dispatched, delivered, cancelled] }
 *         subtotal: { type: integer }
 *         tax: { type: integer }
 *         deliveryFee: { type: integer }
 *         total: { type: integer }
 *
 * /merchandise/products:
 *   get:
 *     summary: List shop products (paged)
 *     tags: [Merchandise & Orders]
 *     parameters:
 *       - { in: query, name: category, schema: { type: string, enum: [artworks, cultural] } }
 *       - { in: query, name: featured, schema: { type: boolean } }
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *     responses:
 *       200:
 *         description: Paged product list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items: { $ref: '#/components/schemas/ProductCard' }
 *                     pagination: { $ref: '#/components/schemas/Pagination' }
 *
 * /merchandise/products/{slug}:
 *   get:
 *     summary: Product detail (includes description + full images + stock)
 *     tags: [Merchandise & Orders]
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Product detail }
 *       404: { description: PRODUCT_NOT_FOUND }
 *
 * /merchandise/products/{slug}/related:
 *   get:
 *     summary: Related products in the same category
 *     tags: [Merchandise & Orders]
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *       - { in: query, name: limit, schema: { type: integer, default: 4 } }
 *     responses:
 *       200: { description: Related products }
 *
 * /merchandise/cart/quote:
 *   post:
 *     summary: Price a cart on the server before checkout
 *     tags: [Merchandise & Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: string }
 *                     quantity: { type: integer, minimum: 1 }
 *               country: { type: string, example: Nigeria }
 *     responses:
 *       200:
 *         description: Quote
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     items: { type: array, items: { type: object } }
 *                     count: { type: integer }
 *                     subtotal: { type: integer }
 *                     tax: { type: integer }
 *                     deliveryFee: { type: integer }
 *                     total: { type: integer }
 *
 * /orders:
 *   post:
 *     summary: Create an order (login required); totals computed server-side
 *     tags: [Merchandise & Orders]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, delivery]
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: string }
 *                     quantity: { type: integer, minimum: 1 }
 *               delivery:
 *                 type: object
 *                 required: [firstName, lastName, email, phone, address, country, state]
 *                 properties:
 *                   firstName: { type: string }
 *                   lastName: { type: string }
 *                   email: { type: string, format: email }
 *                   countryCode: { type: string }
 *                   phone: { type: string }
 *                   address: { type: string }
 *                   country: { type: string }
 *                   state: { type: string }
 *                   city: { type: string }
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/Order' }
 *       409: { description: "OUT_OF_STOCK (data.productId, data.available)" }
 *       400: { description: EMPTY_CART / INVALID_QUANTITY / INVALID_DELIVERY }
 *
 * /orders/me:
 *   get:
 *     summary: Current user's orders (Profile → Orders)
 *     tags: [Merchandise & Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: status, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer } }
 *     responses:
 *       200: { description: Paged order rows }
 *
 * /orders/{id}:
 *   get:
 *     summary: View one order (owner)
 *     tags: [Merchandise & Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Order with items }
 *       404: { description: NOT_FOUND }
 *
 * /orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order (only while pending_payment)
 *     tags: [Merchandise & Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Order cancelled }
 *       400: { description: CANNOT_CANCEL }
 *
 * /admin/merchandise/products:
 *   get:
 *     summary: List all products incl. inactive (admin)
 *     tags: [Merchandise & Orders]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Products }
 *   post:
 *     summary: Create a product (admin)
 *     tags: [Merchandise & Orders]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, price]
 *             properties:
 *               name: { type: string }
 *               category: { type: string, enum: [artworks, cultural] }
 *               price: { type: integer }
 *               stock: { type: integer }
 *               description: { type: string }
 *               images: { type: array, items: { $ref: '#/components/schemas/ProductImage' } }
 *               isFeatured: { type: boolean }
 *               sortOrder: { type: integer }
 *     responses:
 *       201: { description: Product created }
 *
 * /admin/merchandise/products/{id}:
 *   put:
 *     summary: Edit a product (admin). Price change doesn't affect existing orders.
 *     tags: [Merchandise & Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Product updated }
 *   delete:
 *     summary: Soft-delete a product (admin, keeps order history)
 *     tags: [Merchandise & Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Product deleted }
 *
 * /admin/merchandise/products/{id}/stock:
 *   patch:
 *     summary: Set or adjust stock (admin)
 *     tags: [Merchandise & Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock: { type: integer, example: 32 }
 *               adjust: { type: integer, example: -2 }
 *     responses:
 *       200: { description: Stock updated }
 *
 * /admin/orders:
 *   get:
 *     summary: Fulfilment queue (admin)
 *     tags: [Merchandise & Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: status, schema: { type: string } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: from, schema: { type: string, format: date } }
 *       - { in: query, name: to, schema: { type: string, format: date } }
 *     responses:
 *       200: { description: Orders }
 *
 * /admin/orders/{id}/status:
 *   patch:
 *     summary: Update order status + email the buyer (admin)
 *     tags: [Merchandise & Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [dispatched, delivered, cancelled] }
 *               note: { type: string }
 *     responses:
 *       200: { description: Status updated }
 *
 * /admin/orders/export:
 *   get:
 *     summary: Export orders as CSV (admin)
 *     tags: [Merchandise & Orders]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: CSV, content: { text/csv: { schema: { type: string } } } }
 *
 * /admin/merchandise/settings:
 *   get:
 *     summary: Get shop settings (tax, delivery fee)
 *     tags: [Merchandise & Orders]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Settings }
 *   put:
 *     summary: Update shop settings (admin)
 *     tags: [Merchandise & Orders]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               salesTax: { type: integer }
 *               deliveryFee: { type: integer }
 *               deliveryFeeOutsideNigeria: { type: integer }
 *     responses:
 *       200: { description: Settings updated }
 */
