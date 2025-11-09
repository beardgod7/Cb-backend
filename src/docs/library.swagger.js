/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         yearOfPublication:
 *           type: integer
 *           minimum: 1000
 *           maximum: 9999
 *         description:
 *           type: string
 *         coverImage:
 *           type: string
 *         previewPages:
 *           type: array
 *           items:
 *             type: string
 *         tableOfContents:
 *           type: string
 *         isPreviewVisible:
 *           type: boolean
 *         isFeatured:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *         categoryIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
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
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               yearOfPublication:
 *                 type: integer
 *                 minimum: 1000
 *                 maximum: 9999
 *               description:
 *                 type: string
 *               tableOfContents:
 *                 type: string
 *               isPreviewVisible:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *               categoryIds:
 *                 type: string
 *                 description: 'JSON array of category UUIDs, e.g., ["uuid1", "uuid2"]'
 *                 example: '["123e4567-e89b-12d3-a456-426614174000"]'
 *               coverImage:
 *                 type: string
 *                 format: binary
 *               previewPages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 20
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
