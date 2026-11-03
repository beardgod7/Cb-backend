/**
 * @swagger
 * components:
 *   schemas:
 *     Programme:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         slug: { type: string }
 *         title: { type: string }
 *         type: { type: string, enum: [special, annual] }
 *         summary: { type: string }
 *         coverImage: { type: string }
 *         order: { type: integer }
 *         isActive: { type: boolean }
 *     ProgrammeEdition:
 *       type: object
 *       properties:
 *         year: { type: integer }
 *         theme: { type: string }
 *         summary: { type: string }
 *         dates:
 *           type: object
 *           properties:
 *             start: { type: string, format: date }
 *             end: { type: string, format: date }
 *         heroImage: { type: string }
 *         gallery:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url: { type: string }
 *               thumbUrl: { type: string }
 *               caption: { type: string }
 *               width: { type: integer }
 *               height: { type: integer }
 *
 * /programmes:
 *   get:
 *     summary: List programmes (type toggle + search)
 *     tags: [Programmes]
 *     parameters:
 *       - { in: query, name: type, schema: { type: string, enum: [special, annual] } }
 *       - { in: query, name: search, schema: { type: string } }
 *     responses:
 *       200:
 *         description: Programmes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { type: array, items: { $ref: '#/components/schemas/Programme' } }
 *
 * /programmes/{slug}:
 *   get:
 *     summary: Programme header
 *     tags: [Programmes]
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Programme }
 *       404: { description: NOT_FOUND }
 *
 * /programmes/{slug}/editions:
 *   get:
 *     summary: Year picker — editions newest first
 *     tags: [Programmes]
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *     responses:
 *       200:
 *         description: "[{ year, theme }]"
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
 *                       year: { type: integer }
 *                       theme: { type: string }
 *
 * /programmes/{slug}/editions/{year}:
 *   get:
 *     summary: A programme edition for a year, with gallery
 *     tags: [Programmes]
 *     parameters:
 *       - { in: path, name: slug, required: true, schema: { type: string } }
 *       - { in: path, name: year, required: true, schema: { type: integer } }
 *     responses:
 *       200:
 *         description: Edition
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/ProgrammeEdition' }
 *       404: { description: NOT_FOUND }
 *
 * /admin/programmes:
 *   post:
 *     summary: Create a programme (admin)
 *     tags: [Programmes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, type]
 *             properties:
 *               title: { type: string }
 *               type: { type: string, enum: [special, annual] }
 *               summary: { type: string }
 *               coverImage: { type: string }
 *               order: { type: integer }
 *     responses: { 201: { description: Created } }
 *
 * /admin/programmes/{id}:
 *   put:
 *     summary: Update a programme (admin)
 *     tags: [Programmes]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Updated } }
 *   delete:
 *     summary: Delete a programme (admin)
 *     tags: [Programmes]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Deleted } }
 *
 * /admin/programmes/{id}/editions:
 *   post:
 *     summary: Add a year edition (admin)
 *     tags: [Programmes]
 *     security: [{ bearerAuth: [] }]
 *     parameters: [{ in: path, name: id, required: true, schema: { type: string } }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [year]
 *             properties:
 *               year: { type: integer }
 *               theme: { type: string }
 *               summary: { type: string }
 *               dates: { type: object }
 *               heroImage: { type: string }
 *               gallery: { type: array, items: { type: object } }
 *               isPublished: { type: boolean }
 *     responses: { 201: { description: Created } }
 *
 * /admin/programmes/{id}/editions/{year}:
 *   put:
 *     summary: Update a year edition (admin)
 *     tags: [Programmes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *       - { in: path, name: year, required: true, schema: { type: integer } }
 *     responses: { 200: { description: Updated } }
 *   delete:
 *     summary: Delete a year edition (admin)
 *     tags: [Programmes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *       - { in: path, name: year, required: true, schema: { type: integer } }
 *     responses: { 200: { description: Deleted } }
 */
