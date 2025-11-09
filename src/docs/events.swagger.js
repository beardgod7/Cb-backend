/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         EventId:
 *           type: string
 *           format: uuid
 *         Title:
 *           type: string
 *         Organizer:
 *           type: string
 *         Description:
 *           type: string
 *         Location:
 *           type: array
 *           items:
 *             type: string
 *         Date:
 *           type: array
 *           items:
 *             type: string
 *             format: date
 *         EventHighlights:
 *           type: array
 *           items:
 *             type: string
 *         Status:
 *           type: string
 *           enum: [upcoming, past, cancelled]
 *         isPublished:
 *           type: boolean
 *         registrationEnabled:
 *           type: boolean
 *         volunteerEnabled:
 *           type: boolean
 *         eventType:
 *           type: string
 *           enum: [online, offline, hybrid]
 *         maxAttendees:
 *           type: integer
 *         registrationDeadline:
 *           type: string
 *           format: date-time
 *         Images:
 *           type: array
 *           items:
 *             type: string
 *
 * /events/events:
 *   post:
 *     summary: Create a new event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *
 * /events/events/{EventId}:
 *   put:
 *     summary: Update an event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: EventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /events/events/{id}:
 *   delete:
 *     summary: Delete an event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /events/events/publish/{id}:
 *   post:
 *     summary: Publish an event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event published successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 event:
 *                   $ref: '#/components/schemas/Event'
 *
 * /events/events/unpublish/{id}:
 *   post:
 *     summary: Unpublish an event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event unpublished successfully
 *
 * /events/events/duplicate/{id}:
 *   post:
 *     summary: Duplicate an event (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event duplicated successfully
 *
 * /events/events/stats/{id}:
 *   get:
 *     summary: Get event statistics (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *
 * /events/events/drafts:
 *   get:
 *     summary: Get all draft events (Admin only)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Draft events retrieved successfully
 *
 * /events/albums:
 *   post:
 *     summary: Create a new album (Admin only)
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *               Description:
 *                 type: string
 *               Images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Album created successfully
 *
 * /events/albums/{AlbumId}:
 *   put:
 *     summary: Update an album (Admin only)
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: AlbumId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Album updated successfully
 *
 * /events/albums/{id}:
 *   delete:
 *     summary: Delete an album (Admin only)
 *     tags: [Albums]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Album deleted successfully
 */
