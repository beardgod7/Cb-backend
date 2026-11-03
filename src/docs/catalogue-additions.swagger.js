/**
 * Swagger for the new endpoints added to existing catalogue features
 * (Library, Museum, Travels, Events, Films, Podcasts).
 *
 * @swagger
 * /library/books/new-releases:
 *   get:
 *     summary: Newest library books
 *     tags: [Library - Public]
 *     parameters:
 *       - { in: query, name: limit, schema: { type: integer, default: 3 } }
 *     responses:
 *       200: { description: New releases }
 *
 * /library/books/{id}/related:
 *   get:
 *     summary: Related library books
 *     tags: [Library - Public]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *       - { in: query, name: limit, schema: { type: integer, default: 3 } }
 *     responses:
 *       200: { description: Related books }
 *
 * /library/books/{id}/pages:
 *   get:
 *     summary: One library preview page; stops at the preview limit
 *     tags: [Library - Public]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *     responses:
 *       200: { description: Page content }
 *       403: { description: PREVIEW_LIMIT_REACHED }
 *       404: { description: PAGE_NOT_FOUND / RESOURCE_NOT_FOUND }
 *
 * /library/admin/books/{id}/pages:
 *   post:
 *     summary: Upload paged preview content for a library book (admin)
 *     tags: [Library - Admin]
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
 * /museum/terms:
 *   get:
 *     summary: Museum rental Terms & Conditions text
 *     tags: [Museum]
 *     responses:
 *       200:
 *         description: Terms
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     version: { type: string }
 *                     body: { type: string }
 *
 * /museum/rental-requests/me:
 *   get:
 *     summary: The current user's rental requests
 *     tags: [Museum]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Rental requests }
 *
 * /museum/admin/terms:
 *   put:
 *     summary: Update the museum terms (admin)
 *     tags: [Museum]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               version: { type: string }
 *               body: { type: string }
 *     responses:
 *       200: { description: Terms updated }
 *
 * /travels/bookings/me:
 *   get:
 *     summary: The current user's tour + trip bookings
 *     tags: [Tours]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Combined bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type: { type: string, enum: [tour, trip] }
 *                       id: { type: string }
 *                       title: { type: string }
 *                       totalAmount: { type: number }
 *                       paymentStatus: { type: string }
 *                       ticketId: { type: string }
 *
 * /events/{id}/calendar.ics:
 *   get:
 *     summary: Download an iCalendar (.ics) file for the event
 *     tags: [Events - Public]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: iCalendar file
 *         content:
 *           text/calendar:
 *             schema: { type: string }
 *       404: { description: NOT_FOUND }
 *
 * /event/albums:
 *   get:
 *     summary: Albums (optionally for a specific past event)
 *     tags: [Albums]
 *     parameters:
 *       - { in: query, name: eventId, schema: { type: string } }
 *     responses:
 *       200: { description: Albums }
 *
 * /films/films/top-week:
 *   get:
 *     summary: Top films of the week by paid tickets (last 7 days)
 *     tags: [Films]
 *     parameters:
 *       - { in: query, name: limit, schema: { type: integer, default: 4 } }
 *     responses:
 *       200:
 *         description: Ranked films
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       rank: { type: integer }
 *                       bookings7d: { type: integer }
 *                       film: { type: object }
 *
 * /films/terms:
 *   get:
 *     summary: Films Terms & Conditions text
 *     tags: [Films]
 *     responses:
 *       200: { description: "{ version, body }" }
 *
 * /films/bookings/me:
 *   get:
 *     summary: The current user's film bookings
 *     tags: [Films]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Bookings }
 *
 * /films/admin/terms:
 *   put:
 *     summary: Update the films terms (admin)
 *     tags: [Films]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               version: { type: string }
 *               body: { type: string }
 *     responses:
 *       200: { description: Terms updated }
 *
 * /podcasts/seasons:
 *   get:
 *     summary: Season headings with episode counts
 *     tags: [Podcasts]
 *     parameters:
 *       - { in: query, name: mediaType, schema: { type: string, enum: [audio, video] } }
 *     responses:
 *       200:
 *         description: Seasons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       season: { type: integer }
 *                       episodeCount: { type: integer }
 *                       latestPublishedAt: { type: string, format: date-time }
 *
 * /podcasts/published:
 *   get:
 *     summary: Published episodes with filters (mediaType, season, sort)
 *     tags: [Podcasts]
 *     parameters:
 *       - { in: query, name: mediaType, schema: { type: string, enum: [audio, video] } }
 *       - { in: query, name: season, schema: { type: integer } }
 *       - { in: query, name: sort, schema: { type: string, enum: [newest, oldest] } }
 *       - { in: query, name: page, schema: { type: integer } }
 *       - { in: query, name: limit, schema: { type: integer } }
 *     responses:
 *       200: { description: "Episodes { podcasts, totalCount, totalPages, currentPage }" }
 */
