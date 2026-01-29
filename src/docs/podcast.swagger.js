/**
 * @swagger
 * components:
 *   schemas:
 *     Podcast:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - link
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the podcast
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the user who created the podcast
 *         title:
 *           type: string
 *           description: Title of the podcast
 *           maxLength: 255
 *         description:
 *           type: string
 *           description: Description of the podcast
 *         link:
 *           type: string
 *           format: uri
 *           description: URL link to the podcast (optional)
 *         audio:
 *           type: string
 *           format: uri
 *           description: URL link to the audio file (optional)
 *         isPublished:
 *           type: boolean
 *           description: Whether the podcast is published
 *           default: false
 *         isLive:
 *           type: boolean
 *           description: Whether the podcast is currently live
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         userId: "123e4567-e89b-12d3-a456-426614174001"
 *         title: "Tech Talk Weekly"
 *         description: "A weekly podcast about the latest in technology"
 *         link: "https://example.com/podcast/tech-talk-weekly"
 *         audio: "https://example.com/audio/tech-talk-weekly.mp3"
 *         isPublished: true
 *         isLive: false
 *         createdAt: "2024-01-15T10:30:00Z"
 *         updatedAt: "2024-01-15T10:30:00Z"
 *
 *     CreatePodcastRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the podcast
 *           maxLength: 255
 *         description:
 *           type: string
 *           description: Description of the podcast
 *         link:
 *           type: string
 *           format: uri
 *           description: URL link to the podcast (optional)
 *         audio:
 *           type: string
 *           format: uri
 *           description: URL link to the audio file (optional)
 *         isPublished:
 *           type: boolean
 *           description: Whether the podcast is published
 *           default: false
 *         isLive:
 *           type: boolean
 *           description: Whether the podcast is currently live
 *           default: false
 *       example:
 *         title: "Tech Talk Weekly"
 *         description: "A weekly podcast about the latest in technology"
 *         link: "https://example.com/podcast/tech-talk-weekly"
 *         audio: "https://example.com/audio/tech-talk-weekly.mp3"
 *         isPublished: false
 *         isLive: false
 *
 *     UpdatePodcastRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the podcast
 *           maxLength: 255
 *         description:
 *           type: string
 *           description: Description of the podcast
 *         link:
 *           type: string
 *           format: uri
 *           description: URL link to the podcast (optional)
 *         audio:
 *           type: string
 *           format: uri
 *           description: URL link to the audio file (optional)
 *         isPublished:
 *           type: boolean
 *           description: Whether the podcast is published
 *         isLive:
 *           type: boolean
 *           description: Whether the podcast is currently live
 *       example:
 *         title: "Updated Tech Talk Weekly"
 *         description: "An updated weekly podcast about the latest in technology"
 *         audio: "https://example.com/audio/updated-tech-talk-weekly.mp3"
 *         isPublished: true
 *         isLive: true
 *
 *     PodcastListResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         podcasts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Podcast'
 *         totalCount:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         currentPage:
 *           type: integer
 *
 * /api/podcast:
 *   post:
 *     summary: Create a new podcast
 *     tags: [Podcasts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePodcastRequest'
 *     responses:
 *       201:
 *         description: Podcast created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 podcast:
 *                   $ref: '#/components/schemas/Podcast'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin role required
 *
 * /api/podcast/admin:
 *   get:
 *     summary: Get all podcasts (admin only)
 *     tags: [Podcasts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for title or description
 *     responses:
 *       200:
 *         description: Podcasts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PodcastListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin role required
 *
 * /api/podcast/published:
 *   get:
 *     summary: Get published podcasts (public)
 *     tags: [Podcasts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Published podcasts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PodcastListResponse'
 *
 * /api/podcast/live:
 *   get:
 *     summary: Get live podcasts (public)
 *     tags: [Podcasts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Live podcasts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PodcastListResponse'
 *
 * /api/podcast/{id}:
 *   get:
 *     summary: Get podcast by ID
 *     tags: [Podcasts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Podcast ID
 *     responses:
 *       200:
 *         description: Podcast retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 podcast:
 *                   $ref: '#/components/schemas/Podcast'
 *       404:
 *         description: Podcast not found
 *
 *   put:
 *     summary: Update podcast
 *     tags: [Podcasts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Podcast ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePodcastRequest'
 *     responses:
 *       200:
 *         description: Podcast updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 podcast:
 *                   $ref: '#/components/schemas/Podcast'
 *       400:
 *         description: Bad request - validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin role required
 *       404:
 *         description: Podcast not found
 *
 *   delete:
 *     summary: Delete podcast
 *     tags: [Podcasts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Podcast ID
 *     responses:
 *       200:
 *         description: Podcast deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin role required
 *       404:
 *         description: Podcast not found
 */