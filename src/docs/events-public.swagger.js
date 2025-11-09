/**
 * @swagger
 * /event/albums:
 *   get:
 *     summary: Get all albums (Public)
 *     tags: [Events - Public]
 *     responses:
 *       200:
 *         description: Albums retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   AlbumId:
 *                     type: string
 *                   Title:
 *                     type: string
 *                   Description:
 *                     type: string
 *                   Images:
 *                     type: array
 *                     items:
 *                       type: string
 *
 * /event/albums/{id}:
 *   get:
 *     summary: Get album by ID (Public)
 *     tags: [Events - Public]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Album retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /event/events:
 *   get:
 *     summary: Get all events (Public)
 *     tags: [Events - Public]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [past, upcoming]
 *         description: Filter events by status
 *       - in: query
 *         name: published
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by published status
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *
 * /event/events/published:
 *   get:
 *     summary: Get all published events (Public)
 *     tags: [Events - Public]
 *     responses:
 *       200:
 *         description: Published events retrieved successfully
 *
 * /event/events/past:
 *   get:
 *     summary: Get all past events (Public)
 *     tags: [Events - Public]
 *     responses:
 *       200:
 *         description: Past events retrieved successfully
 *
 * /event/events/upcoming:
 *   get:
 *     summary: Get all upcoming events (Public)
 *     tags: [Events - Public]
 *     responses:
 *       200:
 *         description: Upcoming events retrieved successfully
 *
 * /event/events/{id}:
 *   get:
 *     summary: Get event by ID (Public)
 *     tags: [Events - Public]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
