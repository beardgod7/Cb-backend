/**
 * @swagger
 * components:
 *   schemas:
 *     EventBooking:
 *       type: object
 *       required:
 *         - EventId
 *       properties:
 *         EventId:
 *           type: string
 *           format: uuid
 *         FirstName:
 *           type: string
 *           maxLength: 255
 *         LastName:
 *           type: string
 *           maxLength: 255
 *         Email:
 *           type: string
 *           format: email
 *         PhoneNumber:
 *           type: string
 *           maxLength: 255
 *         registrationType:
 *           type: string
 *           enum: [Register, Volunteer, Sponsor]
 *         attendanceStatus:
 *           type: string
 *           enum: [registered, confirmed, attended, cancelled]
 *
 * /eventbooking/book:
 *   post:
 *     summary: Register for an event
 *     tags: [Event Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventBooking'
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 booking:
 *                   $ref: '#/components/schemas/EventBooking'
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 *
 * /eventbooking/bookings/user/{userId}:
 *   get:
 *     summary: Get user's bookings
 *     tags: [Event Bookings]
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
 * /eventbooking/bookings/{id}:
 *   get:
 *     summary: Get booking by ID
 *     tags: [Event Bookings]
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
 *         description: Booking retrieved successfully
 *   delete:
 *     summary: Delete a booking
 *     tags: [Event Bookings]
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
 *         description: Booking deleted successfully
 *
 * /eventbooking/bookings:
 *   get:
 *     summary: Get all bookings (Admin only)
 *     tags: [Event Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All bookings retrieved successfully
 *
 * /eventbooking/bookings/event/{eventId}:
 *   get:
 *     summary: Get bookings by event (Admin only)
 *     tags: [Event Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event bookings retrieved successfully
 *
 * /eventbooking/export/{eventId}:
 *   get:
 *     summary: Export attendees to CSV (Admin only)
 *     tags: [Event Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *
 * /eventbooking/broadcast/{eventId}:
 *   post:
 *     summary: Send broadcast email to all attendees (Admin only)
 *     tags: [Event Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - message
 *             properties:
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Broadcast sent successfully
 *
 * /eventbooking/update-email/{eventId}:
 *   post:
 *     summary: Send event update email (Admin only)
 *     tags: [Event Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - updateMessage
 *             properties:
 *               updateMessage:
 *                 type: string
 *     responses:
 *       200:
 *         description: Update email sent successfully
 *
 * /eventbooking/bookings/{id}/status:
 *   patch:
 *     summary: Update booking status (Admin only)
 *     tags: [Event Bookings]
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
 *               attendanceStatus:
 *                 type: string
 *                 enum: [registered, confirmed, attended, cancelled]
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *
 * /eventbooking/stats/{eventId}:
 *   get:
 *     summary: Get registration statistics (Admin only)
 *     tags: [Event Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *
 * /eventbooking/admin/form-fields:
 *   post:
 *     summary: Create or update form template (Admin only)
 *     tags: [Event Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               EventId:
 *                 type: string
 *               isGlobal:
 *                 type: boolean
 *               fields:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     label:
 *                       type: string
 *                     type:
 *                       type: string
 *                     required:
 *                       type: boolean
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       200:
 *         description: Form template created/updated successfully
 *
 * /eventbooking/admin/{EventId}:
 *   get:
 *     summary: Get form template (Admin only)
 *     tags: [Event Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: EventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Form template retrieved successfully
 */
