/**
 * @swagger
 * components:
 *   schemas:
 *     BookstoreCategory:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the category
 *         name:
 *           type: string
 *           description: Category name
 *         description:
 *           type: string
 *           description: Category description
 *         isActive:
 *           type: boolean
 *           description: Whether the category is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     BookstoreBook:
 *       type: object
 *       required:
 *         - author
 *         - title
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the book
 *         author:
 *           type: string
 *           description: Book author
 *         title:
 *           type: string
 *           description: Book title
 *         price:
 *           type: number
 *           format: decimal
 *           description: Book price
 *         shortDescription:
 *           type: string
 *           description: Short description of the book
 *         longDescription:
 *           type: string
 *           description: Detailed description of the book
 *         numberOfChapters:
 *           type: integer
 *           description: Number of chapters in the book
 *         numberOfPages:
 *           type: integer
 *           description: Number of pages in the book
 *         numberOfParts:
 *           type: integer
 *           description: Number of parts in the book
 *         editors:
 *           type: array
 *           items:
 *             type: string
 *           description: List of editors
 *         previewContent:
 *           oneOf:
 *             - type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   page_title:
 *                     type: string
 *                   text:
 *                     type: string
 *             - type: array
 *               items:
 *                 type: string
 *                 format: uri
 *             - type: string
 *               format: uri
 *           description: Preview pages (text objects, image URLs, or PDF URL)
 *         previewType:
 *           type: string
 *           enum: [text, images, pdf, video, audio]
 *           description: Type of preview pages
 *         coverPage:
 *           type: string
 *           format: uri
 *           description: Cover page image URL
 *         isActive:
 *           type: boolean
 *           description: Whether the book is active
 *         isFeatured:
 *           type: boolean
 *           description: Whether the book is featured
 *         createdBy:
 *           type: string
 *           format: uuid
 *           description: ID of the user who created the book
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BookstoreCategory'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/bookstore/categories:
 *   get:
 *     summary: Get all bookstore categories
 *     tags: [Bookstore - Public]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BookstoreCategory'
 */

/**
 * @swagger
 * /api/bookstore/categories/{id}:
 *   get:
 *     summary: Get bookstore category by ID
 *     tags: [Bookstore - Public]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BookstoreCategory'
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/bookstore/books:
 *   get:
 *     summary: Get all bookstore books
 *     tags: [Bookstore - Public]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title, author, or description
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured books
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BookstoreBook'
 */

/**
 * @swagger
 * /api/bookstore/books/featured:
 *   get:
 *     summary: Get featured bookstore books
 *     tags: [Bookstore - Public]
 *     responses:
 *       200:
 *         description: Featured books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BookstoreBook'
 */

/**
 * @swagger
 * /api/bookstore/books/{id}:
 *   get:
 *     summary: Get bookstore book by ID
 *     tags: [Bookstore - Public]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BookstoreBook'
 *       404:
 *         description: Book not found
 */

/**
 * @swagger
 * /api/bookstore/books/category/{categoryId}:
 *   get:
 *     summary: Get books by category
 *     tags: [Bookstore - Public]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BookstoreBook'
 */

/**
 * @swagger
 * /api/bookstore/admin/categories:
 *   post:
 *     summary: Create a new bookstore category (Admin)
 *     tags: [Bookstore - Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 category:
 *                   $ref: '#/components/schemas/BookstoreCategory'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/bookstore/admin/categories/{id}:
 *   put:
 *     summary: Update bookstore category (Admin)
 *     tags: [Bookstore - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *   delete:
 *     summary: Delete bookstore category (Admin)
 *     tags: [Bookstore - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/bookstore/admin/books:
 *   post:
 *     summary: Create a new bookstore book (Admin)
 *     tags: [Bookstore - Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - author
 *               - title
 *               - price
 *             properties:
 *               author:
 *                 type: string
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: decimal
 *               shortDescription:
 *                 type: string
 *               longDescription:
 *                 type: string
 *               numberOfChapters:
 *                 type: integer
 *               numberOfPages:
 *                 type: integer
 *               numberOfParts:
 *                 type: integer
 *               editors:
 *                 type: string
 *                 description: JSON array of editor names
 *               previewType:
 *                 type: string
 *                 enum: [text, images, pdf, video, audio]
 *               previewPagesText:
 *                 type: string
 *                 description: JSON array for text type preview pages
 *               categoryIds:
 *                 type: string
 *                 description: JSON array of category IDs
 *               isActive:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               coverPage:
 *                 type: string
 *                 format: binary
 *                 description: Cover page image file
 *               previewPagesImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Preview page image files (for images type)
 *               previewPdf:
 *                 type: string
 *                 format: binary
 *                 description: Preview PDF file (for pdf type)
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 book:
 *                   $ref: '#/components/schemas/BookstoreBook'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/bookstore/admin/books/{id}:
 *   put:
 *     summary: Update bookstore book (Admin)
 *     tags: [Bookstore - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               author:
 *                 type: string
 *               title:
 *                 type: string
 *               price:
 *                 type: number
 *                 format: decimal
 *               shortDescription:
 *                 type: string
 *               longDescription:
 *                 type: string
 *               numberOfChapters:
 *                 type: integer
 *               numberOfPages:
 *                 type: integer
 *               numberOfParts:
 *                 type: integer
 *               editors:
 *                 type: string
 *                 description: JSON array of editor names
 *               previewType:
 *                 type: string
 *                 enum: [text, images, pdf, video, audio]
 *               previewPagesText:
 *                 type: string
 *                 description: JSON array for text type preview pages
 *               categoryIds:
 *                 type: string
 *                 description: JSON array of category IDs
 *               isActive:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               coverPage:
 *                 type: string
 *                 format: binary
 *                 description: Cover page image file
 *               previewPagesImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Preview page image files (for images type)
 *               previewPdf:
 *                 type: string
 *                 format: binary
 *                 description: Preview PDF file (for pdf type)
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *   delete:
 *     summary: Delete bookstore book (Admin)
 *     tags: [Bookstore - Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */
