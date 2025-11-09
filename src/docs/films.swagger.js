/**
 * @swagger
 * components:
 *   schemas:
 *     Film:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         director:
 *           type: string
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *         duration:
 *           type: integer
 *         releaseYear:
 *           type: integer
 *         language:
 *           type: string
 *         subtitles:
 *           type: array
 *           items:
 *             type: string
 *         rating:
 *           type: string
 *         isFeatured:
 *           type: boolean
 *         coverImage:
 *           type: string
 *         thumbnails:
 *           type: array
 *           items:
 *             type: string
 *
 * /films/films:
 *   get:
 *     summary: Get all films
 *     tags: [Films]
 *     responses:
 *       200:
 *         description: Films retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Film'
 *
 * /films/films/featured:
 *   get:
 *     summary: Get featured films
 *     tags: [Films]
 *     responses:
 *       200:
 *         description: Featured films retrieved successfully
 *
 * /films/films/{id}:
 *   get:
 *     summary: Get film by ID
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Film retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /films/screening-slots/{filmId}:
 *   get:
 *     summary: Get screening slots for a film
 *     tags: [Films]
 *     parameters:
 *       - in: path
 *         name: filmId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Screening slots retrieved successfully
 *
 * /films/inquiries:
 *   post:
 *     summary: Create a film inquiry
 *     tags: [Films]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inquiry created successfully
 *
 * /films/bookings:
 *   post:
 *     summary: Book a film screening
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - screeningSlotId
 *               - numberOfSeats
 *             properties:
 *               screeningSlotId:
 *                 type: string
 *               numberOfSeats:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Booking created successfully
 *
 * /films/bookings/confirm-payment/{bookingId}:
 *   post:
 *     summary: Confirm film payment
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 *
 * /films/bookings/user/{userId}:
 *   get:
 *     summary: Get user's film bookings
 *     tags: [Films]
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
 *         description: User bookings retrieved successfully
 *
 * /films/admin/films:
 *   post:
 *     summary: Create a new film (Admin only)
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               director:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               thumbnails:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               previewVideo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Film created successfully
 *
 * /films/admin/films/{id}:
 *   put:
 *     summary: Update a film (Admin only)
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *         description: Film updated successfully
 *   delete:
 *     summary: Delete a film (Admin only)
 *     tags: [Films]
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
 *         description: Film deleted successfully
 *
 * /films/admin/screening-slots:
 *   post:
 *     summary: Create a screening slot (Admin only)
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filmId:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               availableSeats:
 *                 type: integer
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Screening slot created successfully
 *
 * /films/admin/screening-slots/{id}:
 *   put:
 *     summary: Update a screening slot (Admin only)
 *     tags: [Films]
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
 *         description: Screening slot updated successfully
 *   delete:
 *     summary: Delete a screening slot (Admin only)
 *     tags: [Films]
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
 *         description: Screening slot deleted successfully
 *
 * /films/admin/bookings:
 *   get:
 *     summary: Get all film bookings (Admin only)
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All bookings retrieved successfully
 *
 * /films/admin/bookings/{id}:
 *   patch:
 *     summary: Update film booking status (Admin only)
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *
 * /films/admin/bookings/export:
 *   get:
 *     summary: Export film bookings (Admin only)
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file download
 *
 * /films/admin/inquiries:
 *   get:
 *     summary: Get all film inquiries (Admin only)
 *     tags: [Films]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All inquiries retrieved successfully
 *
 * /films/admin/inquiries/{id}:
 *   patch:
 *     summary: Update film inquiry status (Admin only)
 *     tags: [Films]
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
 *         description: Inquiry status updated successfully
 */
