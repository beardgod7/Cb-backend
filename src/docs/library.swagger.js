/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         isbn:
 *           type: string
 *         publisher:
 *           type: string
 *         publicationYear:
 *           type: integer
 *         language:
 *           type: string
 *         pages:
 *           type: integer
 *         description:
 *           type: string
 *         categoryId:
 *           type: string
 *         isFeatured:
 *           type: boolean
 *         coverImage:
 *           type: string
 *         availableCopies:
 *           type: integer
 *
 * /library/categories:
 *   get:
 *     summary: Get all library categories
 *     tags: [Library]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *
 * /library/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Library]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *
 * /library/books:
 *   get:
 *     summary: Get all books
 *     tags: [Library]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *
 * /library/books/featured:
 *   get:
 *     summary: Get featured books
 *     tags: [Library]
 *     responses:
 *       200:
 *         description: Featured books retrieved successfully
 *
 * /library/books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Library]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *
 * /library/books/category/{categoryId}:
 *   get:
 *     summary: Get books by category
 *     tags: [Library]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *
 * /library/reading-visits/book:
 *   post:
 *     summary: Book a reading visit
 *     tags: [Library]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - visitDate
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               visitDate:
 *                 type: string
 *                 format: date-time
 *               numberOfPeople:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Reading visit booked successfully
 *
 * /library/contact-librarian:
 *   post:
 *     summary: Contact librarian
 *     tags: [Library]
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
 *         description: Message sent successfully
 *
 * /library/reading-visits/user/{userId}:
 *   get:
 *     summary: Get user's reading visits
 *     tags: [Library]
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
 *         description: Reading visits retrieved successfully
 *
 * /library/admin/categories:
 *   post:
 *     summary: Create a category (Admin only)
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *
 * /library/admin/categories/{id}:
 *   put:
 *     summary: Update a category (Admin only)
 *     tags: [Library]
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
 *         description: Category updated successfully
 *   delete:
 *     summary: Delete a category (Admin only)
 *     tags: [Library]
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
 *         description: Category deleted successfully
 *
 * /library/admin/books:
 *   post:
 *     summary: Create a book (Admin only)
 *     tags: [Library]
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
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               previewPages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Book created successfully
 *
 * /library/admin/books/{id}:
 *   put:
 *     summary: Update a book (Admin only)
 *     tags: [Library]
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
 *         description: Book updated successfully
 *   delete:
 *     summary: Delete a book (Admin only)
 *     tags: [Library]
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
 *         description: Book deleted successfully
 *
 * /library/admin/reading-visits:
 *   get:
 *     summary: Get all reading visits (Admin only)
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reading visits retrieved successfully
 *
 * /library/admin/reading-visits/{id}:
 *   patch:
 *     summary: Update reading visit status (Admin only)
 *     tags: [Library]
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
 *         description: Reading visit status updated successfully
 *
 * /library/admin/contacts:
 *   get:
 *     summary: Get all librarian contacts (Admin only)
 *     tags: [Library]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Contacts retrieved successfully
 *
 * /library/admin/contacts/{id}:
 *   patch:
 *     summary: Update librarian contact status (Admin only)
 *     tags: [Library]
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
 *         description: Contact status updated successfully
 */
