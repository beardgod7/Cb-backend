/**
 * @swagger
 * components:
 *   schemas:
 *     Artifact:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         period:
 *           type: string
 *         origin:
 *           type: string
 *         material:
 *           type: string
 *         dimensions:
 *           type: object
 *         condition:
 *           type: string
 *         isFeatured:
 *           type: boolean
 *         isAvailableForRent:
 *           type: boolean
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         audioNarration:
 *           type: string
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
 *         name: period
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 *                 periods:
 *                   type: array
 *                   items:
 *                     type: string
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
 *               - name
 *               - email
 *               - phone
 *               - organization
 *               - purpose
 *               - startDate
 *               - endDate
 *             properties:
 *               artifactId:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               organization:
 *                 type: string
 *               purpose:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
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
 *               - organization
 *               - proposalDetails
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               organization:
 *                 type: string
 *               proposalDetails:
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               period:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
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
