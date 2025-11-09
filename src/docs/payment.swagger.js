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
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - email
 *               - bookingType
 *               - bookingId
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount in the smallest currency unit (e.g., kobo for NGN)
 *               email:
 *                 type: string
 *                 format: email
 *               currency:
 *                 type: string
 *                 default: NGN
 *               bookingType:
 *                 type: string
 *                 enum: [event, film, tour, trip, library]
 *               bookingId:
 *                 type: string
 *               metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     authorization_url:
 *                       type: string
 *                     access_code:
 *                       type: string
 *                     reference:
 *                       type: string
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
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
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Payment'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /payment/history/{userId}:
 *   get:
 *     summary: Get user payment history
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
