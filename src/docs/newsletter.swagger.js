/**
 * @swagger
 * /health:
 *   get:
 *     summary: Service + database health check (runs SELECT 1)
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 status: { type: string, example: ok }
 *                 database: { type: string, example: up }
 *                 timestamp: { type: string, format: date-time }
 *       503:
 *         description: Database unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 code: { type: string, example: DATABASE_UNAVAILABLE }
 *                 status: { type: string, example: degraded }
 *                 database: { type: string, example: down }
 *
 * /newsletter/subscribe:
 *   post:
 *     summary: Subscribe to the newsletter (double opt-in, rate-limited, honeypot)
 *     tags: [Newsletter]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *               source: { type: string, example: home, description: Page it came from }
 *               website: { type: string, description: Honeypot - must be empty }
 *     responses:
 *       201:
 *         description: Confirmation email sent
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     pending: { type: boolean }
 *       200:
 *         description: Already an active subscriber
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     alreadySubscribed: { type: boolean }
 *       429: { description: Too many requests }
 *
 * /newsletter/confirm:
 *   get:
 *     summary: Confirm a subscription (redirects to the site thank-you page)
 *     tags: [Newsletter]
 *     parameters:
 *       - { in: query, name: token, required: true, schema: { type: string } }
 *     responses:
 *       302: { description: Redirect to thank-you page }
 *       400: { description: INVALID_TOKEN }
 *
 * /newsletter/unsubscribe:
 *   get:
 *     summary: One-click unsubscribe (redirects to the site)
 *     tags: [Newsletter]
 *     parameters:
 *       - { in: query, name: token, required: true, schema: { type: string } }
 *     responses:
 *       302: { description: Redirect to unsubscribed page }
 *       400: { description: INVALID_TOKEN }
 *
 * /admin/newsletter/subscribers:
 *   get:
 *     summary: List subscribers (admin)
 *     tags: [Newsletter]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: status, schema: { type: string, enum: [pending, active, unsubscribed] } }
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *     responses:
 *       200:
 *         description: Paged subscriber list
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
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string }
 *                           email: { type: string }
 *                           status: { type: string }
 *                           source: { type: string }
 *                     pagination: { $ref: '#/components/schemas/Pagination' }
 *       403: { $ref: '#/components/responses/ForbiddenError' }
 *
 * /admin/newsletter/export:
 *   get:
 *     summary: Export subscribers as CSV (admin)
 *     tags: [Newsletter]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: CSV file
 *         content:
 *           text/csv:
 *             schema: { type: string }
 *
 * components:
 *   schemas:
 *     Pagination:
 *       type: object
 *       properties:
 *         page: { type: integer }
 *         limit: { type: integer }
 *         total: { type: integer }
 *         totalPages: { type: integer }
 *         hasNextPage: { type: boolean }
 */
