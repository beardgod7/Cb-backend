/**
 * @swagger
 * components:
 *   schemas:
 *     Tour:
 *       type: object
 *       required:
 *         - title
 *         - fullDescription
 *         - pricePerTicket
 *         - meetingPoint
 *         - availableDays
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         shortDescription:
 *           type: string
 *         fullDescription:
 *           type: string
 *         pricePerTicket:
 *           type: number
 *         duration:
 *           type: string
 *         startTime:
 *           type: string
 *         meetingPoint:
 *           type: string
 *         mapLink:
 *           type: string
 *         availableDays:
 *           type: array
 *           items:
 *             type: string
 *             enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *           minItems: 1
 *           maxItems: 2
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         isActive:
 *           type: boolean
 *         createdBy:
 *           type: string
 *           format: uuid
 *     Trip:
 *       type: object
 *       required:
 *         - title
 *         - destination
 *         - destinationType
 *         - fullDescription
 *         - startDate
 *         - endDate
 *         - pricePerPerson
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         destination:
 *           type: string
 *         destinationType:
 *           type: string
 *           enum: [local, international]
 *         shortDescription:
 *           type: string
 *         fullDescription:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         pricePerPerson:
 *           type: number
 *         itinerary:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               day:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               activities:
 *                 type: array
 *                 items:
 *                   type: string
 *         mapLink:
 *           type: string
 *         maxParticipants:
 *           type: integer
 *         currentBookings:
 *           type: integer
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         isActive:
 *           type: boolean
 *         createdBy:
 *           type: string
 *           format: uuid
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
 *               - fullName
 *               - email
 *               - phoneNumber
 *               - selectedDate
 *               - numberOfTickets
 *             properties:
 *               tourId:
 *                 type: string
 *                 format: uuid
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               selectedDate:
 *                 type: string
 *                 format: date
 *               numberOfTickets:
 *                 type: integer
 *                 minimum: 1
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
 *             required:
 *               - title
 *               - fullDescription
 *               - pricePerTicket
 *               - meetingPoint
 *               - availableDays
 *             properties:
 *               title:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               fullDescription:
 *                 type: string
 *               pricePerTicket:
 *                 type: number
 *                 minimum: 0
 *               duration:
 *                 type: string
 *                 description: 'Duration of the tour (e.g., "2 hours", "Half day")'
 *               startTime:
 *                 type: string
 *                 description: 'Tour start time (e.g., "09:00:00")'
 *               meetingPoint:
 *                 type: string
 *               mapLink:
 *                 type: string
 *                 format: uri
 *               availableDays:
 *                 type: string
 *                 description: 'JSON array of available days (1-2 days), e.g., ["Monday", "Friday"]'
 *                 example: '["Monday", "Friday"]'
 *               isActive:
 *                 type: boolean
 *                 default: true
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 10
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
 *               fullDescription:
 *                 type: string
 *               pricePerTicket:
 *                 type: number
 *                 minimum: 0
 *               duration:
 *                 type: string
 *               startTime:
 *                 type: string
 *               meetingPoint:
 *                 type: string
 *               mapLink:
 *                 type: string
 *                 format: uri
 *               availableDays:
 *                 type: string
 *                 description: 'JSON array of available days (1-2 days)'
 *               isActive:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 10
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
 *               - fullName
 *               - email
 *               - phoneNumber
 *               - numberOfTickets
 *             properties:
 *               tripId:
 *                 type: string
 *                 format: uuid
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               numberOfTickets:
 *                 type: integer
 *                 minimum: 1
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
 *             required:
 *               - title
 *               - destination
 *               - destinationType
 *               - fullDescription
 *               - startDate
 *               - endDate
 *               - pricePerPerson
 *             properties:
 *               title:
 *                 type: string
 *               destination:
 *                 type: string
 *               destinationType:
 *                 type: string
 *                 enum: [local, international]
 *               shortDescription:
 *                 type: string
 *               fullDescription:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               pricePerPerson:
 *                 type: number
 *                 minimum: 0
 *               itinerary:
 *                 type: string
 *                 description: 'JSON array of itinerary items with day, title, description, and activities'
 *                 example: '[{"day": 1, "title": "Arrival", "description": "Check-in and welcome dinner", "activities": ["Check-in", "Dinner"]}]'
 *               mapLink:
 *                 type: string
 *                 format: uri
 *               maxParticipants:
 *                 type: integer
 *                 minimum: 1
 *               isActive:
 *                 type: boolean
 *                 default: true
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 10
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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               destination:
 *                 type: string
 *               destinationType:
 *                 type: string
 *                 enum: [local, international]
 *               shortDescription:
 *                 type: string
 *               fullDescription:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               pricePerPerson:
 *                 type: number
 *                 minimum: 0
 *               itinerary:
 *                 type: string
 *                 description: 'JSON array of itinerary items'
 *               mapLink:
 *                 type: string
 *                 format: uri
 *               maxParticipants:
 *                 type: integer
 *                 minimum: 1
 *               isActive:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 10
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
