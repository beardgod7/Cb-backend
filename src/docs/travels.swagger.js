/**
 * @swagger
 * components:
 *   schemas:
 *     Tour:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         destination:
 *           type: string
 *         duration:
 *           type: string
 *         price:
 *           type: number
 *         maxParticipants:
 *           type: integer
 *         difficulty:
 *           type: string
 *           enum: [easy, moderate, challenging]
 *         includes:
 *           type: array
 *           items:
 *             type: string
 *         excludes:
 *           type: array
 *           items:
 *             type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *     Trip:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         destination:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         price:
 *           type: number
 *         maxParticipants:
 *           type: integer
 *         images:
 *           type: array
 *           items:
 *             type: string
 *
 * /travels/tours:
 *   get:
 *     summary: Get all tours
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tours retrieved successfully
 *
 * /travels/tours/{id}:
 *   get:
 *     summary: Get tour by ID
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour retrieved successfully
 *
 * /travels/tours/calendar/{tourId}:
 *   get:
 *     summary: Get tour calendar/availability
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour calendar retrieved successfully
 *
 * /travels/tours/inquire:
 *   post:
 *     summary: Create a tour inquiry
 *     tags: [Tours]
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
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inquiry created successfully
 *
 * /travels/tours/book:
 *   post:
 *     summary: Book a tour
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tourId
 *               - numberOfPeople
 *               - preferredDate
 *             properties:
 *               tourId:
 *                 type: string
 *               numberOfPeople:
 *                 type: integer
 *               preferredDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Tour booked successfully
 *
 * /travels/tours/confirm-payment/{bookingId}:
 *   post:
 *     summary: Confirm tour payment
 *     tags: [Tours]
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
 * /travels/tours/admin/tours:
 *   post:
 *     summary: Create a tour (Admin only)
 *     tags: [Tours]
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
 *               destination:
 *                 type: string
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Tour created successfully
 *
 * /travels/tours/admin/tours/{id}:
 *   put:
 *     summary: Update a tour (Admin only)
 *     tags: [Tours]
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
 *         description: Tour updated successfully
 *   delete:
 *     summary: Delete a tour (Admin only)
 *     tags: [Tours]
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
 *         description: Tour deleted successfully
 *
 * /travels/tours/admin/bookings:
 *   get:
 *     summary: Get all tour bookings (Admin only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tour bookings retrieved successfully
 *
 * /travels/tours/admin/bookings/tour/{tourId}:
 *   get:
 *     summary: Get bookings for a specific tour (Admin only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour bookings retrieved successfully
 *
 * /travels/tours/admin/export/{tourId}:
 *   get:
 *     summary: Export tour bookings (Admin only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CSV file download
 *
 * /travels/tours/admin/resend/{bookingId}:
 *   post:
 *     summary: Resend tour ticket (Admin only)
 *     tags: [Tours]
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
 *         description: Ticket resent successfully
 *
 * /travels/tours/admin/inquiries:
 *   get:
 *     summary: Get all tour inquiries (Admin only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tour inquiries retrieved successfully
 *
 * /travels/tours/admin/inquiries/{id}:
 *   patch:
 *     summary: Update tour inquiry status (Admin only)
 *     tags: [Tours]
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
 *
 * /travels/trips:
 *   get:
 *     summary: Get all trips
 *     tags: [Trips]
 *     parameters:
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Trips retrieved successfully
 *
 * /travels/trips/{id}:
 *   get:
 *     summary: Get trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip retrieved successfully
 *
 * /travels/trips/inquire:
 *   post:
 *     summary: Create a trip inquiry
 *     tags: [Trips]
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
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inquiry created successfully
 *
 * /travels/trips/book:
 *   post:
 *     summary: Book a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tripId
 *               - numberOfPeople
 *             properties:
 *               tripId:
 *                 type: string
 *               numberOfPeople:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Trip booked successfully
 *
 * /travels/trips/confirm-payment/{bookingId}:
 *   post:
 *     summary: Confirm trip payment
 *     tags: [Trips]
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
 * /travels/trips/admin/trips:
 *   post:
 *     summary: Create a trip (Admin only)
 *     tags: [Trips]
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
 *               destination:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               price:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Trip created successfully
 *
 * /travels/trips/admin/trips/{id}:
 *   put:
 *     summary: Update a trip (Admin only)
 *     tags: [Trips]
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
 *         description: Trip updated successfully
 *   delete:
 *     summary: Delete a trip (Admin only)
 *     tags: [Trips]
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
 *         description: Trip deleted successfully
 *
 * /travels/trips/admin/bookings:
 *   get:
 *     summary: Get all trip bookings (Admin only)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trip bookings retrieved successfully
 *
 * /travels/trips/admin/bookings/trip/{tripId}:
 *   get:
 *     summary: Get bookings for a specific trip (Admin only)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip bookings retrieved successfully
 *
 * /travels/trips/admin/export/{tripId}:
 *   get:
 *     summary: Export trip bookings (Admin only)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CSV file download
 *
 * /travels/trips/admin/resend/{bookingId}:
 *   post:
 *     summary: Resend trip ticket (Admin only)
 *     tags: [Trips]
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
 *         description: Ticket resent successfully
 *
 * /travels/trips/admin/inquiries:
 *   get:
 *     summary: Get all trip inquiries (Admin only)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trip inquiries retrieved successfully
 *
 * /travels/trips/admin/inquiries/{id}:
 *   patch:
 *     summary: Update trip inquiry status (Admin only)
 *     tags: [Trips]
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
