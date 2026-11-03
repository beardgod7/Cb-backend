/**
 * @swagger
 * components:
 *   schemas:
 *     ArchiveItemCard:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         slug: { type: string }
 *         title: { type: string }
 *         year: { type: integer }
 *         typeLabel: { type: string }
 *         place: { type: string }
 *         thumbnail: { type: string }
 *         summary: { type: string }
 *         collection:
 *           type: object
 *           properties:
 *             slug: { type: string }
 *             title: { type: string }
 *             itemKind: { type: string, enum: [document, photoSet, idCard] }
 *         subcategory:
 *           type: object
 *           properties:
 *             slug: { type: string }
 *             title: { type: string }
 *
 * /archives/collections:
 *   get:
 *     summary: List published collections with their sub-categories
 *     tags: [Archives]
 *     responses:
 *       200:
 *         description: Collections
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       slug: { type: string }
 *                       title: { type: string }
 *                       itemKind: { type: string }
 *                       subcategories:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id: { type: string }
 *                             slug: { type: string }
 *                             title: { type: string }
 *                             itemCount: { type: integer }
 *
 * /archives/collections/{slug}:
 *   get:
 *     summary: Collection landing (each sub-category with its first N items)
 *     tags: [Archives]
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *       - { in: query, name: perSubcategory, schema: { type: integer, default: 3 } }
 *     responses:
 *       200: { description: Collection with sections }
 *       404: { description: NOT_FOUND }
 *
 * /archives/items:
 *   get:
 *     summary: Paginated item cards (sub-category list / SEE ALL)
 *     tags: [Archives]
 *     parameters:
 *       - { in: query, name: collection, schema: { type: string } }
 *       - { in: query, name: subcategory, schema: { type: string } }
 *       - { in: query, name: search, schema: { type: string } }
 *       - { in: query, name: year, schema: { type: integer } }
 *       - { in: query, name: sort, schema: { type: string, enum: [newest, title] } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 9, maximum: 48 } }
 *     responses:
 *       200:
 *         description: Paged item cards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     items: { type: array, items: { $ref: '#/components/schemas/ArchiveItemCard' } }
 *                     pagination: { $ref: '#/components/schemas/Pagination' }
 *
 * /archives/items/{slug}:
 *   get:
 *     summary: Full item (kind-specific fields; documents return pageCount, not pages)
 *     tags: [Archives]
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Item detail }
 *       404: { description: NOT_FOUND }
 *
 * /archives/items/{slug}/pages:
 *   get:
 *     summary: One reader page; blocked past the preview limit
 *     tags: [Archives]
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *     responses:
 *       200:
 *         description: Page content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     pageNumber: { type: integer }
 *                     pageCount: { type: integer }
 *                     previewPageLimit: { type: integer }
 *                     isLastPreviewPage: { type: boolean }
 *                     heading: { type: string }
 *                     body: { type: string }
 *                     imageUrl: { type: string, nullable: true }
 *       403: { description: "PREVIEW_LIMIT_REACHED (data.previewPageLimit, data.pageCount)" }
 *       404: { description: Page or item not found }
 *
 * /admin/archives/collections:
 *   post:
 *     summary: Create a collection (admin)
 *     tags: [Archives]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, itemKind]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               itemKind: { type: string, enum: [document, photoSet, idCard] }
 *               coverImage: { type: string }
 *               order: { type: integer }
 *               isPublished: { type: boolean }
 *     responses:
 *       201: { description: Created }
 *
 * /admin/archives/collections/{id}:
 *   patch:
 *     summary: Update a collection (admin)
 *     tags: [Archives]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Updated }, 404: { description: NOT_FOUND } }
 *   delete:
 *     summary: Delete a collection (admin)
 *     tags: [Archives]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Deleted } }
 *
 * /admin/archives/subcategories:
 *   post:
 *     summary: Create a sub-category (admin)
 *     tags: [Archives]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [collectionId, title]
 *             properties:
 *               collectionId: { type: string }
 *               title: { type: string }
 *               order: { type: integer }
 *     responses: { 201: { description: Created } }
 *
 * /admin/archives/subcategories/{id}:
 *   patch:
 *     summary: Update a sub-category (admin)
 *     tags: [Archives]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Updated } }
 *   delete:
 *     summary: Delete a sub-category (admin)
 *     tags: [Archives]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Deleted } }
 *
 * /admin/archives/items:
 *   get:
 *     summary: List items incl. unpublished (admin)
 *     tags: [Archives]
 *     security: [{ bearerAuth: [] }]
 *     responses: { 200: { description: Paged items } }
 *   post:
 *     summary: Create an item with shared + kind fields (admin)
 *     tags: [Archives]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [collectionId, title]
 *             properties:
 *               collectionId: { type: string }
 *               subcategoryId: { type: string }
 *               title: { type: string }
 *               year: { type: integer }
 *               typeLabel: { type: string }
 *               place: { type: string }
 *               summary: { type: string }
 *               thumbnail: { type: string }
 *               tags: { type: array, items: { type: string } }
 *               authors: { type: array, items: { type: string } }
 *               abstract: { type: string }
 *               previewPageLimit: { type: integer }
 *               photos: { type: array, items: { type: object } }
 *               participantName: { type: string }
 *               country: { type: string }
 *               role: { type: string }
 *               cardNumber: { type: string }
 *               isPublished: { type: boolean }
 *     responses: { 201: { description: Created } }
 *
 * /admin/archives/items/{id}:
 *   patch:
 *     summary: Edit an item (admin)
 *     tags: [Archives]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Updated } }
 *   delete:
 *     summary: Soft-delete an item (admin)
 *     tags: [Archives]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Deleted } }
 *
 * /admin/archives/items/{id}/publish:
 *   patch:
 *     summary: Publish or unpublish an item (admin)
 *     tags: [Archives]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties: { isPublished: { type: boolean } }
 *     responses: { 200: { description: Updated } }
 *
 * /admin/archives/items/{id}/pages:
 *   post:
 *     summary: Upload document pages (admin). Sets pageCount.
 *     tags: [Archives]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [pages]
 *             properties:
 *               pages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     pageNumber: { type: integer }
 *                     heading: { type: string }
 *                     body: { type: string }
 *                     imageUrl: { type: string }
 *     responses: { 200: { description: Pages uploaded } }
 */
