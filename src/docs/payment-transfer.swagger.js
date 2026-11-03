/**
 * @swagger
 * /payment/bank-details:
 *   get:
 *     summary: Bank transfer account details shown on the payment screen
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: Bank details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     accountName: { type: string }
 *                     bankName: { type: string }
 *                     accountNumber: { type: string }
 *
 * /payment/transfer-notices:
 *   post:
 *     summary: Submit a bank-transfer notice for a booking/order
 *     tags: [Payment]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [bookingType, bookingId]
 *             properties:
 *               bookingType: { type: string, enum: [merchandise, bookstore, tour, trip, film, event, museum, library] }
 *               bookingId: { type: string }
 *               senderBank: { type: string }
 *               senderName: { type: string }
 *               proofUrl: { type: string }
 *     responses:
 *       201:
 *         description: Transfer notice submitted (status pending); booking moves to awaiting_transfer
 *       404: { description: BOOKING_NOT_FOUND }
 *       409: { description: ALREADY_PAID }
 *
 * /payment/transfer-notices/me:
 *   get:
 *     summary: The current user's transfer notices
 *     tags: [Payment]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Transfer notices }
 *
 * /payment/admin/transfer-notices:
 *   get:
 *     summary: Review queue of transfer notices (admin)
 *     tags: [Payment]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: status, schema: { type: string, enum: [pending, confirmed, rejected] } }
 *     responses:
 *       200: { description: Transfer notices }
 *
 * /payment/admin/transfer-notices/{id}:
 *   patch:
 *     summary: Confirm or reject a transfer notice (admin). Confirm runs the paid path.
 *     tags: [Payment]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [confirmed, rejected] }
 *               adminNote: { type: string }
 *     responses:
 *       200: { description: Reviewed }
 *       404: { description: NOT_FOUND }
 */
