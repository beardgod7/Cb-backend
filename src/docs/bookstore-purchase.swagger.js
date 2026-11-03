/**
 * @swagger
 * components:
 *   schemas:
 *     BookPurchase:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         bookId: { type: string }
 *         title: { type: string }
 *         price: { type: integer }
 *         status: { type: string, enum: [pending_payment, awaiting_transfer, paid, refunded] }
 *         downloadCount: { type: integer }
 *         paidAt: { type: string, format: date-time }
 *
 * /bookstore/books/{idOrSlug}:
 *   get:
 *     summary: Book detail (adds pageCount, previewPageLimit, publisher, editors[], owned flag)
 *     tags: [Bookstore - Public]
 *     parameters:
 *       - { in: path, name: idOrSlug, required: true, schema: { type: string } }
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Book detail (owned true when the logged-in user bought it)
 *       404: { description: BOOK_NOT_FOUND }
 *
 * /bookstore/books/{id}/related:
 *   get:
 *     summary: Related books ("You might like")
 *     tags: [Bookstore - Public]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *       - { in: query, name: limit, schema: { type: integer, default: 4 } }
 *     responses:
 *       200: { description: Related books }
 *
 * /bookstore/books/{id}/pages:
 *   get:
 *     summary: One preview page; owners read all pages, others stop at the limit
 *     tags: [Bookstore - Public]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Page content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     pageNumber: { type: integer }
 *                     pageCount: { type: integer }
 *                     previewPageLimit: { type: integer }
 *                     heading: { type: string }
 *                     body: { type: string }
 *                     imageUrl: { type: string, nullable: true }
 *       403: { description: "PREVIEW_LIMIT_REACHED (data.previewPageLimit, data.pageCount)" }
 *       404: { description: Page or book not found }
 *
 * /bookstore/purchases:
 *   post:
 *     summary: Buy a book ("Book Now"). Buying again returns the existing purchase.
 *     tags: [Bookstore - Public]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookId]
 *             properties:
 *               bookId: { type: string }
 *     responses:
 *       201:
 *         description: Purchase created (pending_payment)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     status: { type: string }
 *                     title: { type: string }
 *                     amount: { type: integer }
 *       409: { description: "ALREADY_OWNED (data.purchaseId)" }
 *       404: { description: BOOK_NOT_FOUND }
 *
 * /bookstore/purchases/me:
 *   get:
 *     summary: My book purchases (Profile → Orders, books)
 *     tags: [Bookstore - Public]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Purchases
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { type: array, items: { $ref: '#/components/schemas/BookPurchase' } }
 *
 * /bookstore/purchases/{id}/download:
 *   get:
 *     summary: Get a short-lived signed download link (owner, paid)
 *     tags: [Bookstore - Public]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Download link (valid 15 minutes)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     url: { type: string }
 *                     expiresAt: { type: string, format: date-time }
 *       403: { description: NOT_PAID }
 *       429: { description: DOWNLOAD_LIMIT }
 *       404: { description: NOT_FOUND }
 *
 * /bookstore/admin/books/{id}/file:
 *   post:
 *     summary: Set the full file (private storage key) for a book (admin)
 *     tags: [Bookstore - Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullFileKey]
 *             properties:
 *               fullFileKey: { type: string }
 *     responses:
 *       200: { description: File set }
 *
 * /bookstore/admin/books/{id}/pages:
 *   post:
 *     summary: Upload preview/full pages for a book (admin)
 *     tags: [Bookstore - Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pages]
 *             properties:
 *               pages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     pageNumber: { type: integer }
 *                     heading: { type: string }
 *                     body: { type: string }
 *                     imageUrl: { type: string }
 *     responses:
 *       200: { description: Pages uploaded }
 *
 * /bookstore/admin/purchases:
 *   get:
 *     summary: List book purchases (admin)
 *     tags: [Bookstore - Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: from, schema: { type: string, format: date } }
 *       - { in: query, name: to, schema: { type: string, format: date } }
 *     responses:
 *       200: { description: Purchases }
 */
