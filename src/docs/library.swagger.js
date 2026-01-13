/**
 * @swagger
 * components:
 *   schemas:
 *     LibraryCategory:
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
 *     LibraryBook:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the book
 *         title:
 *           type: string
 *           description: Book title
 *         author:
 *           type: string
 *           description: Book author
 *         yearOfPublication:
 *           type: integer
 *           minimum: 1000
 *           maximum: 9999
 *           description: Year the book was published
 *         description:
 *           type: string
 *           description: Book description
 *         coverImage:
 *           type: string
 *           format: uri
 *           description: Cover image URL
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
 *         previewPagesType:
 *           type: string
 *           enum: [text, images, pdf]
 *           description: Type of preview pages
 *         tableOfContentsContent:
 *           oneOf:
 *             - type: array
 *               items:
 *                 type: string
 *             - type: array
 *               items:
 *                 type: string
 *                 format: uri
 *             - type: string
 *               format: uri
 *           description: Table of contents (text array, image URLs, or PDF URL)
 *         tableOfContentsType:
 *           type: string
 *           enum: [text, images, pdf]
 *           description: Type of table of contents
 *         abstractPreviewContent:
 *           oneOf:
 *             - type: string
 *             - type: array
 *               items:
 *                 type: string
 *                 format: uri
 *             - type: string
 *               format: uri
 *           description: Abstract preview (text, image URLs, or PDF URL)
 *         abstractPreviewType:
 *           type: string
 *           enum: [text, images, pdf]
 *           description: Type of abstract preview
 *         otherPreviewContent:
 *           oneOf:
 *             - type: array
 *               items:
 *                 type: object
 *             - type: array
 *               items:
 *                 type: string
 *                 format: uri
 *             - type: string
 *               format: uri
 *           description: Other preview pages content
 *         otherPreviewPagesType:
 *           type: string
 *           enum: [text, images, pdf]
 *           description: Type of other preview pages
 *         scheduledVisitDate:
 *           type: string
 *           format: date
 *           description: Scheduled date for library visit
 *         isPreviewVisible:
 *           type: boolean
 *           description: Whether preview is visible
 *         isFeatured:
 *           type: boolean
 *           description: Whether the book is featured
 *         isMostPopular:
 *           type: boolean
 *           description: Whether the book is most popular
 *         isActive:
 *           type: boolean
 *           description: Whether the book is active
 *         createdBy:
 *           type: string
 *           format: uuid
 *           description: ID of the user who created the book
 *         categories:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LibraryCategory'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/library/categories:
 *   get:
 *     summary: Get all library categories
 *     tags: [Library - Public]
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
 *                     $ref: '#/components/schemas/LibraryCategory'
 */

/**
 * @swagger
 * /api/library/categories/{id}:
 *   get:
 *     summary: Get library category by ID
 *     tags: [Library - Public]
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
 *                   $ref: '#/components/schemas/LibraryCategory'
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /api/library/books:
 *   get:
 *     summary: Get all library books
 *     tags: [Library - Public]
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
 *                     $ref: '#/components/schemas/LibraryBook'
 */

/**
 * @swagger
 * /api/library/books/featured:
 *   get:
 *     summary: Get featured library books
 *     tags: [Library - Public]
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
 *                     $ref: '#/components/schemas/LibraryBook'
 */

/**
 * @swagger
 * /api/library/books/popular:
 *   get:
 *     summary: Get most popular library books
 *     tags: [Library - Public]
 *     responses:
 *       200:
 *         description: Most popular books retrieved successfully
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
 *                     $ref: '#/components/schemas/LibraryBook'
 */

/**
 * @swagger
 * /api/library/books/{id}:
 *   get:
 *     summary: Get library book by ID
 *     tags: [Library - Public]
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
 *                   $ref: '#/components/schemas/LibraryBook'
 *       404:
 *         description: Book not found
 */

/**
 * @swagger
 * /api/library/books/category/{categoryId}:
 *   get:
 *     summary: Get books by category
 *     tags: [Library - Public]
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
 *                     $ref: '#/components/schemas/LibraryBook'
 */

/**
 * @swagger
 * /api/library/admin/categories:
 *   post:
 *     summary: Create a new library category (Admin)
 *     tags: [Library - Admin]
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
 *                   $ref: '#/components/schemas/LibraryCategory'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/library/admin/categories/{id}:
 *   put:
 *     summary: Update library category (Admin)
 *     tags: [Library - Admin]
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
 *     summary: Delete library category (Admin)
 *     tags: [Library - Admin]
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
 * /api/library/admin/books:
 *   post:
 *     summary: Create a new library book (Admin)
 *     tags: [Library - Admin]
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
 *               previewPagesType:
 *                 type: string
 *                 enum: [text, images, pdf]
 *               previewPagesText:
 *                 type: string
 *                 description: JSON array for text type preview pages
 *               tableOfContentsType:
 *                 type: string
 *                 enum: [text, images, pdf]
 *               tableOfContentsText:
 *                 type: string
 *                 description: JSON array for text type table of contents
 *               abstractPreviewType:
 *                 type: string
 *                 enum: [text, images, pdf]
 *               abstractPreviewText:
 *                 type: string
 *                 description: Text or JSON for abstract preview
 *               otherPreviewPagesType:
 *                 type: string
 *                 enum: [text, images, pdf]
 *               otherPreviewPagesText:
 *                 type: string
 *                 description: JSON for other preview pages
 *               scheduledVisitDate:
 *                 type: string
 *                 format: date
 *               categoryIds:
 *                 type: string
 *                 description: JSON array of category IDs
 *               isPreviewVisible:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               isMostPopular:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Cover image file
 *               previewPagesImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Preview page image files (for images type)
 *               previewPagesPdf:
 *                 type: string
 *                 format: binary
 *                 description: Preview pages PDF file (for pdf type)
 *               tableOfContentsImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Table of contents image files (for images type)
 *               tableOfContentsPdf:
 *                 type: string
 *                 format: binary
 *                 description: Table of contents PDF file (for pdf type)
 *               abstractPreviewImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Abstract preview image files (for images type)
 *               abstractPreviewPdf:
 *                 type: string
 *                 format: binary
 *                 description: Abstract preview PDF file (for pdf type)
 *               otherPreviewPagesImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Other preview page image files (for images type)
 *               otherPreviewPagesPdf:
 *                 type: string
 *                 format: binary
 *                 description: Other preview pages PDF file (for pdf type)
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
 *                   $ref: '#/components/schemas/LibraryBook'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/library/admin/books/{id}:
 *   put:
 *     summary: Update library book (Admin)
 *     tags: [Library - Admin]
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
 *               previewPagesType:
 *                 type: string
 *                 enum: [text, images, pdf]
 *               previewPagesText:
 *                 type: string
 *                 description: JSON array for text type preview pages
 *               tableOfContentsType:
 *                 type: string
 *                 enum: [text, images, pdf]
 *               tableOfContentsText:
 *                 type: string
 *                 description: JSON array for text type table of contents
 *               abstractPreviewType:
 *                 type: string
 *                 enum: [text, images, pdf]
 *               abstractPreviewText:
 *                 type: string
 *                 description: Text or JSON for abstract preview
 *               otherPreviewPagesType:
 *                 type: string
 *                 enum: [text, images, pdf]
 *               otherPreviewPagesText:
 *                 type: string
 *                 description: JSON for other preview pages
 *               scheduledVisitDate:
 *                 type: string
 *                 format: date
 *               categoryIds:
 *                 type: string
 *                 description: JSON array of category IDs
 *               isPreviewVisible:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               isMostPopular:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *               coverImage:
 *                 type: string
 *                 format: binary
 *                 description: Cover image file
 *               previewPagesImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Preview page image files (for images type)
 *               previewPagesPdf:
 *                 type: string
 *                 format: binary
 *                 description: Preview pages PDF file (for pdf type)
 *               tableOfContentsImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Table of contents image files (for images type)
 *               tableOfContentsPdf:
 *                 type: string
 *                 format: binary
 *                 description: Table of contents PDF file (for pdf type)
 *               abstractPreviewImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Abstract preview image files (for images type)
 *               abstractPreviewPdf:
 *                 type: string
 *                 format: binary
 *                 description: Abstract preview PDF file (for pdf type)
 *               otherPreviewPagesImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Other preview page image files (for images type)
 *               otherPreviewPagesPdf:
 *                 type: string
 *                 format: binary
 *                 description: Other preview pages PDF file (for pdf type)
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *   delete:
 *     summary: Delete library book (Admin)
 *     tags: [Library - Admin]
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