/**
 * @swagger
 * components:
 *   schemas:
 *     VisitRequest:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         resourceType: { type: string, enum: [library, archive] }
 *         resourceId: { type: string }
 *         resourceTitle: { type: string }
 *         visitDate: { type: string, format: date }
 *         note: { type: string }
 *         status: { type: string, enum: [pending, approved, declined, cancelled] }
 *         adminNote: { type: string }
 *
 * /visits/availability:
 *   get:
 *     summary: Which calendar dates can be booked for a visit
 *     tags: [Visits]
 *     parameters:
 *       - { in: query, name: from, required: true, schema: { type: string, format: date } }
 *       - { in: query, name: to, required: true, schema: { type: string, format: date } }
 *     responses:
 *       200:
 *         description: Dates with availability
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     dates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date: { type: string, format: date }
 *                           available: { type: boolean }
 *                           remaining: { type: integer }
 *
 * /visits:
 *   post:
 *     summary: Book a reading/archive visit
 *     tags: [Visits]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [resourceType, resourceId, visitDate]
 *             properties:
 *               resourceType: { type: string, enum: [library, archive] }
 *               resourceId: { type: string }
 *               visitDate: { type: string, format: date }
 *               note: { type: string }
 *     responses:
 *       201:
 *         description: Visit requested
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
 *                     status: { type: string, example: pending }
 *                     visitDate: { type: string, format: date }
 *                     resourceTitle: { type: string }
 *       400: { description: DATE_UNAVAILABLE / DATE_IN_PAST }
 *       404: { description: RESOURCE_NOT_FOUND }
 *       409: { description: DUPLICATE_VISIT }
 *
 * /visits/me:
 *   get:
 *     summary: My visits, newest first
 *     tags: [Visits]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Visits
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { type: array, items: { $ref: '#/components/schemas/VisitRequest' } }
 *
 * /visits/{id}/cancel:
 *   patch:
 *     summary: Cancel a visit (owner, while pending or approved)
 *     tags: [Visits]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Visit cancelled }
 *       400: { description: CANNOT_CANCEL }
 *       404: { description: NOT_FOUND }
 *
 * /admin/visits:
 *   get:
 *     summary: Review queue (admin)
 *     tags: [Visits]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: status, schema: { type: string } }
 *       - { in: query, name: resourceType, schema: { type: string, enum: [library, archive] } }
 *       - { in: query, name: from, schema: { type: string, format: date } }
 *       - { in: query, name: to, schema: { type: string, format: date } }
 *       - { in: query, name: page, schema: { type: integer } }
 *     responses:
 *       200: { description: Paged visits }
 *
 * /admin/visits/{id}:
 *   patch:
 *     summary: Approve or decline a visit (admin)
 *     tags: [Visits]
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
 *               status: { type: string, enum: [approved, declined] }
 *               adminNote: { type: string }
 *     responses:
 *       200: { description: Reviewed }
 *
 * /admin/visits/settings:
 *   get:
 *     summary: Get visit settings (open days, closed dates, capacity)
 *     tags: [Visits]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Settings }
 *   put:
 *     summary: Update visit settings (admin)
 *     tags: [Visits]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               openWeekdays: { type: array, items: { type: integer }, example: [1,2,3,4,5] }
 *               closedDates: { type: array, items: { type: string, format: date } }
 *               dailyCapacity: { type: integer, example: 10 }
 *               leadDays: { type: integer, example: 1 }
 *     responses:
 *       200: { description: Settings updated }
 */
