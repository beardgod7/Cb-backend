/**
 * @swagger
 * components:
 *   schemas:
 *     ApiError:
 *       type: object
 *       properties:
 *         success: { type: boolean, example: false }
 *         code: { type: string, example: VALIDATION_FAILED }
 *         message: { type: string }
 *         errors:
 *           type: object
 *           additionalProperties: { type: string }
 *     UserProfile:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         firstName: { type: string }
 *         lastName: { type: string }
 *         email: { type: string, format: email }
 *         phoneNumber: { type: string }
 *         profession: { type: string }
 *         country: { type: string }
 *         state: { type: string }
 *         role: { type: string, enum: [User, Admin, SuperAdmin] }
 *         createdAt: { type: string, format: date-time }
 *         profileCompleted: { type: boolean }
 *     Address:
 *       type: object
 *       properties:
 *         id: { type: string, format: uuid }
 *         label: { type: string, example: Home }
 *         firstName: { type: string }
 *         lastName: { type: string }
 *         phone: { type: string }
 *         address: { type: string }
 *         country: { type: string }
 *         state: { type: string }
 *         city: { type: string }
 *         postalCode: { type: string }
 *         isDefault: { type: boolean }
 *
 * /auth/signup:
 *   post:
 *     summary: Public sign-up (step 1). Role is never accepted from the client.
 *     tags: [Accounts & Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               name: { type: string, example: John Doe, description: Split on first space into first/last }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       201:
 *         description: Account created; OTP sent to email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId: { type: string }
 *                     email: { type: string, example: "jo***@example.com" }
 *                     verificationRequired: { type: boolean }
 *       409: { description: EMAIL_TAKEN }
 *       400: { description: WEAK_PASSWORD / VALIDATION_FAILED }
 *
 * /auth/verify-otp:
 *   post:
 *     summary: Verify the 5-digit OTP (tied to email) and log in
 *     tags: [Accounts & Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, code]
 *             properties:
 *               email: { type: string, format: email }
 *               code: { type: string, example: "88348" }
 *     responses:
 *       200:
 *         description: Verified and logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     token: { type: string }
 *                     refreshToken: { type: string }
 *                     user:
 *                       type: object
 *                       properties:
 *                         id: { type: string }
 *                         firstName: { type: string }
 *                         profileCompleted: { type: boolean }
 *       400: { description: "INVALID_CODE (data.attemptsLeft)" }
 *       410: { description: CODE_EXPIRED }
 *       429: { description: TOO_MANY_ATTEMPTS }
 *
 * /auth/resend-verification:
 *   post:
 *     summary: Resend the OTP (rate-limited to once a minute)
 *     tags: [Accounts & Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200: { description: Code sent }
 *       429: { description: TOO_MANY_ATTEMPTS }
 *
 * /auth/forgot-password:
 *   post:
 *     summary: Send a password reset link to the site (token valid 1 hour)
 *     tags: [Accounts & Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200: { description: Reset link sent if the account exists }
 *
 * /auth/reset-password:
 *   post:
 *     summary: Reset the password with the emailed token (single use)
 *     tags: [Accounts & Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token: { type: string }
 *               password: { type: string, minLength: 8 }
 *     responses:
 *       200: { description: Password reset }
 *       400: { description: INVALID_TOKEN }
 *
 * /auth/me:
 *   get:
 *     summary: Current user's profile
 *     tags: [Accounts & Profile]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/UserProfile' }
 *       401: { $ref: '#/components/responses/UnauthorizedError' }
 *   patch:
 *     summary: Update profile (profession+country+state completes step 2)
 *     tags: [Accounts & Profile]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phoneNumber: { type: string }
 *               profession: { type: string }
 *               country: { type: string }
 *               state: { type: string }
 *     responses:
 *       200:
 *         description: Updated profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data: { $ref: '#/components/schemas/UserProfile' }
 *   delete:
 *     summary: Soft-delete the account (requires current password)
 *     tags: [Accounts & Profile]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password: { type: string }
 *     responses:
 *       200: { description: Account deleted }
 *       400: { description: WRONG_PASSWORD }
 *
 * /auth/me/password:
 *   patch:
 *     summary: Change password (signs out other sessions)
 *     tags: [Accounts & Profile]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string, minLength: 8 }
 *     responses:
 *       200: { description: Password changed }
 *       400: { description: WRONG_PASSWORD }
 *
 * /auth/me/addresses:
 *   get:
 *     summary: List billing/delivery addresses (default first)
 *     tags: [Accounts & Profile]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Addresses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Address' }
 *   post:
 *     summary: Add an address
 *     tags: [Accounts & Profile]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [address, country, state]
 *             properties:
 *               label: { type: string }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *               country: { type: string }
 *               state: { type: string }
 *               city: { type: string }
 *               postalCode: { type: string }
 *               isDefault: { type: boolean }
 *     responses:
 *       201: { description: Address added }
 *
 * /auth/me/addresses/{id}:
 *   patch:
 *     summary: Update an address
 *     tags: [Accounts & Profile]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Address updated }
 *       404: { description: NOT_FOUND }
 *   delete:
 *     summary: Delete an address
 *     tags: [Accounts & Profile]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Address deleted }
 *
 * /auth/me/addresses/{id}/default:
 *   patch:
 *     summary: Make this the default address
 *     tags: [Accounts & Profile]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: string } }
 *     responses:
 *       200: { description: Default address updated }
 */
