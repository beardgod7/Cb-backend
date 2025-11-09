/**
 * @swagger
 * components:
 *   schemas:
 *     Artifact:
 *       type: object
 *       required:
 *         - identificationNumber
 *         - title
 *         - country
 *         - category
 *         - fullDescription
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         identificationNumber:
 *           type: string
 *         title:
 *           type: string
 *         country:
 *           type: string
 *         category:
 *           type: string
 *         era:
 *           type: string
 *         yearOrPeriod:
 *           type: string
 *         shortDescription:
 *           type: string
 *           maxLength: 500
 *         fullDescription:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         audioNarration:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         isActive:
 *           type: boolean
 *         isFeatured:
 *           type: boolean
 *
 * /museum/artifacts:
 *   get:
 *     summary: Get all artifacts
 *     tags: [Museum]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artifacts retrieved successfully
 *
 * /museum/artifacts/featured:
 *   get:
 *     summary: Get featured artifacts
 *     tags: [Museum]
 *     responses:
 *       200:
 *         description: Featured artifacts retrieved successfully
 *
 * /museum/artifacts/{id}:
 *   get:
 *     summary: Get artifact by ID
 *     tags: [Museum]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artifact retrieved successfully
 *
 * /museum/filter-options:
 *   get:
 *     summary: Get filter options for artifacts
 *     tags: [Museum]
 *     responses:
 *       200:
 *         description: Filter options retrieved successfully
 *
 * /museum/rental-requests:
 *   post:
 *     summary: Create an artifact rental request
 *     tags: [Museum]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - artifactId
 *               - fullName
 *               - email
 *               - phoneNumber
 *               - purposeOfRental
 *               - startDate
 *               - endDate
 *             properties:
 *               artifactId:
 *                 type: string
 *                 format: uuid
 *               fullName:
 *                 type: string
 *               organization:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNumber:
 *                 type: string
 *               purposeOfRental:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rental request created successfully
 *
 * /museum/collaboration-requests:
 *   post:
 *     summary: Create a collaboration request
 *     tags: [Museum]
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
 *               organization:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Collaboration request created successfully
 *
 * /museum/rental-requests/user/{userId}:
 *   get:
 *     summary: Get user's rental requests
 *     tags: [Museum]
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
 *         description: Rental requests retrieved successfully
 *
 * /museum/admin/artifacts:
 *   post:
 *     summary: Create an artifact (Admin only)
 *     tags: [Museum]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - identificationNumber
 *               - title
 *               - country
 *               - category
 *               - fullDescription
 *             properties:
 *               identificationNumber:
 *                 type: string
 *               title:
 *                 type: string
 *               country:
 *                 type: string
 *               category:
 *                 type: string
 *               era:
 *                 type: string
 *               yearOrPeriod:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *                 maxLength: 500
 *               fullDescription:
 *                 type: string
 *               tags:
 *                 type: string
 *                 description: 'JSON array of tags, e.g., ["ancient", "pottery"]'
 *                 example: '["ancient", "pottery", "ceremonial"]'
 *               isActive:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 10
 *               audioNarration:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Artifact created successfully
 *
 * /museum/admin/artifacts/{id}:
 *   put:
 *     summary: Update an artifact (Admin only)
 *     tags: [Museum]
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
 *               identificationNumber:
 *                 type: string
 *               title:
 *                 type: string
 *               country:
 *                 type: string
 *               category:
 *                 type: string
 *               era:
 *                 type: string
 *               yearOrPeriod:
 *                 type: string
 *               shortDescription:
 *                 type: string
 *               fullDescription:
 *                 type: string
 *               tags:
 *                 type: string
 *                 description: 'JSON array of tags'
 *               isActive:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               audioNarration:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Artifact updated successfully
 *   delete:
 *     summary: Delete an artifact (Admin only)
 *     tags: [Museum]
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
 *         description: Artifact deleted successfully
 *
 * /museum/admin/rental-requests:
 *   get:
 *     summary: Get all rental requests (Admin only)
 *     tags: [Museum]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rental requests retrieved successfully
 *
 * /museum/admin/rental-requests/{id}:
 *   patch:
 *     summary: Update rental request status (Admin only)
 *     tags: [Museum]
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
 *                 enum: [pending, approved, rejected, completed]
 *     responses:
 *       200:
 *         description: Rental request status updated successfully
 *
 * /museum/admin/collaboration-requests:
 *   get:
 *     summary: Get all collaboration requests (Admin only)
 *     tags: [Museum]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Collaboration requests retrieved successfully
 *
 * /museum/admin/collaboration-requests/{id}:
 *   patch:
 *     summary: Update collaboration request status (Admin only)
 *     tags: [Museum]
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
 *                 enum: [pending, under_review, approved, rejected]
 *     responses:
 *       200:
 *         description: Collaboration request status updated successfully
 */
