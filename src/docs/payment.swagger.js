/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         reference:
 *           type: string
 *         amount:
 *           type: number
 *         currency:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, success, failed, cancelled]
 *         paymentMethod:
 *           type: string
 *         userId:
 *           type: string
 *         bookingType:
 *           type: string
 *         bookingId:
 *           type: string
 *
 * /payment/initialize:
 *   post:
 *     summary: Initialize a payment
 *     description: >
 *       Creates a payment against an existing booking/order. The amount is read
 *       from the booking on the server (never from the client) and converted to
 *       kobo internally. Requires a logged-in user.
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookingType
 *               - bookingId
 *             properties:
 *               bookingType:
 *                 type: string
 *                 enum: [event, tour, trip, film, library, merchandise, bookstore, museum]
 *               bookingId:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Optional; falls back to the booking's email
 *               gateway:
 *                 type: string
 *                 enum: [paystack, flutterwave, stripe]
 *                 default: paystack
 *               callbackUrl:
 *                 type: string
 *                 description: Optional; must be on the site's own domain
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     authorization_url:
 *                       type: string
 *                     reference:
 *                       type: string
 *                     amount:
 *                       type: number
 *                       description: Naira (whole number)
 *                     currency:
 *                       type: string
 *                       example: NGN
 *       400:
 *         description: INVALID_BOOKING_TYPE / INVALID_CALLBACK_URL
 *       404:
 *         description: BOOKING_NOT_FOUND
 *       409:
 *         description: ALREADY_PAID
 *
 * /payment/verify/{reference}:
 *   get:
 *     summary: Verify a payment
 *     tags: [Payment]
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment reference to verify
 *     description: >
 *       Re-checks the payment with the gateway (not just the database), so a buyer
 *       who closed the tab before the webhook arrived still gets marked paid. Safe
 *       to call repeatedly. Returns a summary of what was bought.
 *     responses:
 *       200:
 *         description: Payment verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference: { type: string }
 *                     status: { type: string, enum: [success, failed] }
 *                     amount: { type: number, description: Naira }
 *                     currency: { type: string }
 *                     bookingType: { type: string }
 *                     bookingId: { type: string }
 *                     paidAt: { type: string, format: date-time }
 *                     summary:
 *                       type: object
 *                       properties:
 *                         title: { type: string }
 *                         lines: { type: array, items: { type: string } }
 *                         email: { type: string }
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /payment/history/me:
 *   get:
 *     summary: Current user's payment history
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history
 *
 * /payment/history/{userId}:
 *   get:
 *     summary: Get a user's payment history (admin only)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *
 * /payment/admin/transactions:
 *   get:
 *     summary: Get all transactions (Admin only)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, success, failed, cancelled]
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *
 * /payment/admin/statistics:
 *   get:
 *     summary: Get payment statistics (Admin only)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                 totalTransactions:
 *                   type: integer
 *                 successfulTransactions:
 *                   type: integer
 *                 failedTransactions:
 *                   type: integer
 *                 pendingTransactions:
 *                   type: integer
 *
 * /payment/webhook/paystack:
 *   post:
 *     summary: Paystack webhook endpoint
 *     tags: [Payment]
 *     description: Webhook endpoint for Paystack payment notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *
 * /payment/webhook/flutterwave:
 *   post:
 *     summary: Flutterwave webhook endpoint
 *     tags: [Payment]
 *     description: Webhook endpoint for Flutterwave payment notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *
 * /payment/webhook/stripe:
 *   post:
 *     summary: Stripe webhook endpoint
 *     tags: [Payment]
 *     description: Webhook endpoint for Stripe payment notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 */
