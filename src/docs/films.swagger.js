/**
 * @swagger
 * components:
 *   schemas:
 *     Film:
 *       type: object
 *       required:
 *         - title
 *         - fullDescription
 *         - category
 *         - ticketPrice
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         shortDescription:
 *           type: string
 *           maxLength: 500
 *         fullDescription:
 *           type: string
 *         yearOfRecording:
 *           type: integer
 *           minimum: 1900
 *           maximum: 2100
 *         duration:
 *           type: string
 *         category:
 *           type: string
 *         country:
 *           type: string
 *         festivalYear:
 *           type: string
 *         coverImage:
 *           type: string
 *         thumbnailGallery:
 *           type: array
 *           items:
 *             type: string
 *         previewVideo:
 *           type: string
 *         fullVideo:
 *           type: string
 *         ticketPrice:
 *           type: number
 *           minimum: 0
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         isActive:
 *           type: boolean
 *         isFeatured:
 *           type: boolean
 *
 * /films/films:
 *   get:
 *     summary: Get all films
 *     tags: [Films]
 *     responses:
 *       200:
 *         description: Films retrieved successfully
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
 *               - fullName
 *               - email
 *               - phoneNumber
 *               - message
 *             properties:
 *               filmId:
 *                 type: string
 *                 format: uuid
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
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
 *               - filmId
 *               - screeningSlotId
 *               - fullName
 *               - email
 *               - phoneNumber
 *               - numberOfSeats
 *             properties:
 *               filmId:
 *                 type: string
 *                 format: uuid
 *               screeningSlotId:
 *                 type: string
 *                 format: uuid
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               numberOfSeats:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10
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
 *             required:
 *               - title
 *               - fullDescription
 *               - category
 *               - ticketPrice
 *             properties:
 *               title:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *                 maxLength: 500
 *               fullDescription:
 *                 type: string
 *               yearOfRecording:
 *                 type: integer
 *                 minimum: 1900
 *                 maximum: 2100
 *               duration:
 *                 type: string
 *               category:
 *                 type: string
 *               country:
 *                 type: string
 *               festivalYear:
 *                 type: string
 *               ticketPrice:
 *                 type: number
 *                 minimum: 0
 *               tags:
 *                 type: string
 *                 description: 'JSON array of tags, e.g., ["documentary", "historical"]'
 *                 example: '["documentary", "historical"]'
 *               isActive:
 *                 type: boolean
 *                 default: true
 *               isFeatured:
 *                 type: boolean
 *                 default: false
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
 *               fullVideo:
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
 *             properties:
 *               title:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *                 maxLength: 500
 *               fullDescription:
 *                 type: string
 *               yearOfRecording:
 *                 type: integer
 *                 minimum: 1900
 *                 maximum: 2100
 *               duration:
 *                 type: string
 *               category:
 *                 type: string
 *               country:
 *                 type: string
 *               festivalYear:
 *                 type: string
 *               ticketPrice:
 *                 type: number
 *                 minimum: 0
 *               tags:
 *                 type: string
 *                 description: 'JSON array of tags'
 *               isActive:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
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
 *               fullVideo:
 *                 type: string
 *                 format: binary
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
 *             required:
 *               - filmId
 *               - screeningDate
 *               - startTime
 *             properties:
 *               filmId:
 *                 type: string
 *                 format: uuid
 *               screeningDate:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               maxSeats:
 *                 type: integer
 *                 minimum: 1
 *               isAvailable:
 *                 type: boolean
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
