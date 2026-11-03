const {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  getAllUsersWithProfiles,
} = require("./repository");

const Userhash = require("../../utils/bcrypt");
const {
  signupSchema,
  signinSchema,
  verifyOtpSchema,
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendVerificationSchema,
  addressSchema,
  updateAddressSchema,
} = require("./schema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/generatetoken");
const {
  sendVerificationCodeEmail,
  sendResetCodeEmail,
  sendPasswordResetEmail,
  sendMail,
} = require("../../service/emailservice");
const { User, Token, Address } = require("./model");
const { ok, fail, AppError } = require("../../utils/apiResponse");

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_OTP_ATTEMPTS = 5;
const SITE_URL = process.env.SITE_URL || "https://cbaac.gov.ng";

function generate5DigitCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

function maskEmail(email) {
  const [local, domain] = String(email).split("@");
  if (!domain) return email;
  const shown = local.slice(0, 2);
  return `${shown}${"*".repeat(Math.max(1, local.length - 2))}@${domain}`;
}

function splitName(name) {
  const parts = String(name || "").trim().split(/\s+/);
  const firstName = parts.shift() || "";
  const lastName = parts.join(" ") || "";
  return { firstName, lastName };
}

function publicUser(user) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profession: user.profession,
    country: user.country,
    state: user.state,
    role: user.role,
    createdAt: user.createdAt,
    profileCompleted: !!user.profileCompletedAt,
  };
}

// ============ Sign up (step 1) ============
async function signup(req, res, next) {
  try {
    const data = await signupSchema.validateAsync(req.body);

    let { firstName, lastName } = data;
    if (!firstName && data.name) {
      ({ firstName, lastName } = splitName(data.name));
    }

    const email = data.email.toLowerCase();
    const existing = await findUserByEmail(email);
    if (existing) {
      throw new AppError("EMAIL_TAKEN", "An account with this email already exists.", 409);
    }

    // SECURITY: role is never taken from the public form. Always "User".
    const newUser = await createUser({
      email,
      password: data.password,
      firstName,
      lastName,
      role: "User",
      verified: false,
    });

    const code = generate5DigitCode();
    await Token.destroy({ where: { userId: newUser.id, token_type: "verify_account" } });
    await Token.create({
      userId: newUser.id,
      token: code,
      token_type: "verify_account",
      expiresIn: new Date(Date.now() + OTP_TTL_MS),
      attempts: 0,
    });

    try {
      await sendVerificationCodeEmail(newUser.email, code);
    } catch (e) {
      console.error("OTP email failed:", e.message);
    }

    return ok(res, {
      status: 201,
      message: "Account created. Enter the code we sent to your email.",
      data: {
        userId: newUser.id,
        email: maskEmail(newUser.email),
        verificationRequired: true,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Admin Signup (kept, still forces Admin role — only reachable where mounted/guarded)
async function AdminSignup(req, res, next) {
  try {
    const data = await signupSchema.validateAsync(req.body);
    let { firstName, lastName } = data;
    if (!firstName && data.name) ({ firstName, lastName } = splitName(data.name));
    const email = data.email.toLowerCase();
    const existing = await findUserByEmail(email);
    if (existing) throw new AppError("EMAIL_TAKEN", "An account with this email already exists.", 409);
    const newUser = await createUser({
      email,
      password: data.password,
      firstName,
      lastName,
      role: "Admin",
      verified: true,
    });
    return ok(res, { status: 201, message: "Admin created", data: publicUser(newUser) });
  } catch (err) {
    next(err);
  }
}

// ============ OTP verification (replaces GET /auth/verify/:code) ============
async function verifyOtp(req, res, next) {
  try {
    const { email, code } = await verifyOtpSchema.validateAsync(req.body);

    const user = await findUserByEmail(email);
    if (!user) throw new AppError("INVALID_CODE", "Invalid verification code.", 400);

    const tokenRecord = await Token.findOne({
      where: { userId: user.id, token_type: "verify_account" },
    });
    if (!tokenRecord) {
      throw new AppError("INVALID_CODE", "No active code. Please request a new one.", 400);
    }

    if (new Date(tokenRecord.expiresIn).getTime() < Date.now()) {
      await tokenRecord.destroy();
      throw new AppError("CODE_EXPIRED", "The code has expired. Please request a new one.", 410);
    }

    if (tokenRecord.attempts >= MAX_OTP_ATTEMPTS) {
      await tokenRecord.destroy();
      throw new AppError("TOO_MANY_ATTEMPTS", "Too many attempts. Please request a new code.", 429);
    }

    if (tokenRecord.token !== String(code)) {
      tokenRecord.attempts += 1;
      await tokenRecord.save();
      const attemptsLeft = Math.max(0, MAX_OTP_ATTEMPTS - tokenRecord.attempts);
      throw new AppError("INVALID_CODE", "Incorrect code.", 400, { data: { attemptsLeft } });
    }

    user.verified = true;
    await user.save();
    await tokenRecord.destroy();

    // Log the user in.
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    await storeRefresh(user.id, refreshToken);

    return ok(res, {
      message: "Account verified successfully.",
      data: {
        token: accessToken,
        refreshToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          profileCompleted: !!user.profileCompletedAt,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

// Legacy GET /auth/verify/:code kept for backward compatibility.
async function verifyEmail(req, res, next) {
  try {
    let { code } = req.params;
    code = String(code).replace(/^:/, "").trim();
    if (!code) throw new AppError("INVALID_CODE", "Verification code is required.", 400);

    const tokenRecord = await Token.findOne({
      where: { token: code, token_type: "verify_account" },
    });
    if (!tokenRecord) throw new AppError("INVALID_CODE", "Invalid or expired verification code.", 400);
    if (new Date(tokenRecord.expiresIn).getTime() < Date.now()) {
      await tokenRecord.destroy();
      throw new AppError("CODE_EXPIRED", "Verification code has expired.", 410);
    }
    const user = await User.findByPk(tokenRecord.userId);
    if (!user) throw new AppError("USER_NOT_FOUND", "User not found.", 404);
    user.verified = true;
    await user.save();
    await tokenRecord.destroy();
    return ok(res, { message: "Account verified successfully!" });
  } catch (error) {
    next(error);
  }
}

async function resendVerificationCode(req, res, next) {
  try {
    const { email } = await resendVerificationSchema.validateAsync(req.body);
    const user = await findUserByEmail(email);
    if (!user) throw new AppError("USER_NOT_FOUND", "User not found.", 404);
    if (user.verified) {
      return ok(res, { message: "User is already verified." });
    }

    // Rate-limit: one resend per minute.
    const existing = await Token.findOne({
      where: { userId: user.id, token_type: "verify_account" },
    });
    if (existing) {
      const issuedAt = new Date(existing.expiresIn).getTime() - OTP_TTL_MS;
      if (Date.now() - issuedAt < 60 * 1000) {
        throw new AppError("TOO_MANY_ATTEMPTS", "Please wait a minute before requesting another code.", 429);
      }
      await existing.destroy();
    }

    const code = generate5DigitCode();
    await Token.create({
      userId: user.id,
      token: code,
      token_type: "verify_account",
      expiresIn: new Date(Date.now() + OTP_TTL_MS),
      attempts: 0,
    });
    await sendVerificationCodeEmail(user.email, code);
    return ok(res, { message: "Verification code sent successfully." });
  } catch (error) {
    next(error);
  }
}

// ============ Login ============
async function login(req, res, next) {
  try {
    const { identifier, password } = await signinSchema.validateAsync(req.body);
    const email = identifier.includes("@") ? identifier.toLowerCase() : identifier;
    const user = await findUserByEmail(email);

    if (!user || user.deletedAt) {
      throw new AppError("INVALID_CREDENTIALS", "Invalid credentials.", 401);
    }

    if (!user.verified) {
      // Re-issue an OTP and signal the frontend to open the OTP screen.
      const code = generate5DigitCode();
      await Token.destroy({ where: { userId: user.id, token_type: "verify_account" } });
      await Token.create({
        userId: user.id,
        token: code,
        token_type: "verify_account",
        expiresIn: new Date(Date.now() + OTP_TTL_MS),
        attempts: 0,
      });
      try { await sendVerificationCodeEmail(user.email, code); } catch (_) {}
      throw new AppError("EMAIL_NOT_VERIFIED", "Account not verified. A new code has been sent to your email.", 403);
    }

    const isMatch = await Userhash.comparePassword(password, user.password);
    if (!isMatch) throw new AppError("INVALID_CREDENTIALS", "Invalid credentials.", 401);

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    await storeRefresh(user.id, refreshToken);

    return ok(res, {
      message: "Login successful",
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        role: user.role,
        verification: user.verified,
        id: user.id,
        user: publicUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
}

async function storeRefresh(userId, refreshToken) {
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  let tokenRecord = await Token.findOne({ where: { userId, token_type: "refresh_token" } });
  if (tokenRecord) {
    tokenRecord.token = refreshToken;
    tokenRecord.expiresIn = new Date(decoded.exp * 1000);
    await tokenRecord.save();
  } else {
    await Token.create({
      userId,
      token: refreshToken,
      token_type: "refresh_token",
      expiresIn: new Date(decoded.exp * 1000),
    });
  }
}

async function refreshToken(req, res, next) {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) throw new AppError("BAD_REQUEST", "Refresh token is required", 400);

    const storedToken = await Token.findOne({
      where: { token: refresh_token, token_type: "refresh_token" },
    });
    if (!storedToken || storedToken.expiresIn < Date.now()) {
      throw new AppError("INVALID_TOKEN", "Invalid or expired refresh token", 403);
    }

    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
    const newAccessToken = generateAccessToken(decoded.sub, decoded.role);
    const newRefreshToken = generateRefreshToken(decoded.sub);
    const decodedNew = jwt.verify(newRefreshToken, process.env.JWT_SECRET);

    storedToken.token = newRefreshToken;
    storedToken.expiresIn = new Date(decodedNew.exp * 1000);
    await storedToken.save();

    return ok(res, {
      message: "Token refreshed successfully",
      data: { access_token: newAccessToken, refresh_token: newRefreshToken },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token) throw new AppError("BAD_REQUEST", "Refresh token is missing.", 400);
    const deleted = await Token.destroy({
      where: { token: refresh_token, token_type: "refresh_token" },
    });
    if (!deleted) throw new AppError("INVALID_TOKEN", "Invalid or non-existent refresh token.", 400);
    return ok(res, { message: "Logout successful. Refresh token invalidated." });
  } catch (error) {
    next(error);
  }
}

// ============ Password reset (link to the site) ============
async function forgotPassword(req, res, next) {
  try {
    const { email } = await forgotPasswordSchema.validateAsync(req.body);
    const user = await findUserByEmail(email);
    // Don't reveal whether the email exists.
    if (user) {
      const token = crypto.randomBytes(24).toString("hex");
      await Token.destroy({ where: { userId: user.id, token_type: "reset_password" } });
      await Token.create({
        userId: user.id,
        token,
        token_type: "reset_password",
        expiresIn: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      });
      const resetLink = `${SITE_URL}/reset-password?token=${token}`;
      try {
        await sendMail({
          to: user.email,
          subject: "Reset your CBAAC password",
          html: `
            <p>We received a request to reset your password.</p>
            <p><a href="${resetLink}">Reset password</a></p>
            <p>Or paste this link into your browser:<br>${resetLink}</p>
            <p>This link is valid for 1 hour and can be used once. If you didn't request it, ignore this email.</p>
          `,
        });
      } catch (_) {}
    }
    return ok(res, {
      message: "If an account exists for that email, a reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = await resetPasswordSchema.validateAsync(req.body);
    const tokenRecord = await Token.findOne({
      where: { token, token_type: "reset_password" },
    });
    if (!tokenRecord || tokenRecord.expiresIn < Date.now()) {
      throw new AppError("INVALID_TOKEN", "Invalid or expired token.", 400);
    }
    const user = await User.findByPk(tokenRecord.userId);
    if (!user) throw new AppError("USER_NOT_FOUND", "User not found.", 404);

    user.password = await Userhash.hashPassword(password);
    await user.save();
    await tokenRecord.destroy();
    // Sign out other sessions.
    await Token.destroy({ where: { userId: user.id, token_type: "refresh_token" } });
    return ok(res, { message: "Password reset successfully." });
  } catch (error) {
    next(error);
  }
}

// ============ Profile: /auth/me ============
async function getMe(req, res, next) {
  try {
    const user = await findUserById(req.userId);
    if (!user || user.deletedAt) throw new AppError("USER_NOT_FOUND", "User not found.", 404);
    return ok(res, { message: "Profile retrieved", data: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const data = await updateProfileSchema.validateAsync(req.body);
    const user = await findUserById(req.userId);
    if (!user || user.deletedAt) throw new AppError("USER_NOT_FOUND", "User not found.", 404);

    Object.assign(user, data);
    // Mark profile complete once step-2 fields are present.
    if (user.profession && user.country && user.state && !user.profileCompletedAt) {
      user.profileCompletedAt = new Date();
    }
    await user.save();
    return ok(res, { message: "Profile updated", data: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = await changePasswordSchema.validateAsync(req.body);
    const user = await findUserById(req.userId);
    if (!user) throw new AppError("USER_NOT_FOUND", "User not found.", 404);
    const match = await Userhash.comparePassword(currentPassword, user.password);
    if (!match) throw new AppError("WRONG_PASSWORD", "Current password is incorrect.", 400);
    user.password = await Userhash.hashPassword(newPassword);
    await user.save();
    // Sign out other sessions.
    await Token.destroy({ where: { userId: user.id, token_type: "refresh_token" } });
    return ok(res, { message: "Password changed. Please log in again on other devices." });
  } catch (err) {
    next(err);
  }
}

async function deleteMe(req, res, next) {
  try {
    const { password } = await deleteAccountSchema.validateAsync(req.body);
    const user = await findUserById(req.userId);
    if (!user) throw new AppError("USER_NOT_FOUND", "User not found.", 404);
    const match = await Userhash.comparePassword(password, user.password);
    if (!match) throw new AppError("WRONG_PASSWORD", "Password is incorrect.", 400);

    // Soft delete: clear personal data, keep the row (orders/payments anonymised).
    user.deletedAt = new Date();
    user.firstName = null;
    user.lastName = null;
    user.phoneNumber = null;
    user.profession = null;
    user.country = null;
    user.state = null;
    user.email = `deleted+${user.id}@cbaac.invalid`;
    await user.save();
    await Token.destroy({ where: { userId: user.id } });
    await Address.destroy({ where: { userId: user.id } });
    return ok(res, { message: "Your account has been deleted." });
  } catch (err) {
    next(err);
  }
}

// ============ Addresses ============
async function listAddresses(req, res, next) {
  try {
    const addresses = await Address.findAll({
      where: { userId: req.userId },
      order: [["isDefault", "DESC"], ["createdAt", "DESC"]],
    });
    return ok(res, { message: "Addresses retrieved", data: addresses });
  } catch (err) {
    next(err);
  }
}

async function addAddress(req, res, next) {
  try {
    const data = await addressSchema.validateAsync(req.body);
    const count = await Address.count({ where: { userId: req.userId } });
    const isDefault = data.isDefault || count === 0;
    if (isDefault) {
      await Address.update({ isDefault: false }, { where: { userId: req.userId } });
    }
    const address = await Address.create({ ...data, userId: req.userId, isDefault });
    return ok(res, { status: 201, message: "Address added", data: address });
  } catch (err) {
    next(err);
  }
}

async function updateAddress(req, res, next) {
  try {
    const data = await updateAddressSchema.validateAsync(req.body);
    const address = await Address.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!address) throw new AppError("NOT_FOUND", "Address not found.", 404);
    if (data.isDefault) {
      await Address.update({ isDefault: false }, { where: { userId: req.userId } });
    }
    Object.assign(address, data);
    await address.save();
    return ok(res, { message: "Address updated", data: address });
  } catch (err) {
    next(err);
  }
}

async function deleteAddress(req, res, next) {
  try {
    const address = await Address.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!address) throw new AppError("NOT_FOUND", "Address not found.", 404);
    const wasDefault = address.isDefault;
    await address.destroy();
    if (wasDefault) {
      const next = await Address.findOne({ where: { userId: req.userId }, order: [["createdAt", "DESC"]] });
      if (next) { next.isDefault = true; await next.save(); }
    }
    return ok(res, { message: "Address deleted" });
  } catch (err) {
    next(err);
  }
}

async function setDefaultAddress(req, res, next) {
  try {
    const address = await Address.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!address) throw new AppError("NOT_FOUND", "Address not found.", 404);
    await Address.update({ isDefault: false }, { where: { userId: req.userId } });
    address.isDefault = true;
    await address.save();
    return ok(res, { message: "Default address updated", data: address });
  } catch (err) {
    next(err);
  }
}

// ============ Admin / legacy ============
async function getUsersById(req, res, next) {
  try {
    const user = await findUserById(req.params.id);
    if (!user) throw new AppError("USER_NOT_FOUND", "User not found", 404);
    return ok(res, { message: "User retrieved", data: publicUser(user) });
  } catch (error) {
    next(error);
  }
}

async function approveUser(req, res, next) {
  try {
    const updatedUser = await updateUser(req.params.id, { isApproved: true });
    if (!updatedUser) throw new AppError("USER_NOT_FOUND", "User not found", 404);
    return ok(res, { message: "User approved successfully", data: publicUser(updatedUser) });
  } catch (error) {
    next(error);
  }
}

async function getUsers(req, res, next) {
  try {
    const users = await getAllUsersWithProfiles();
    return ok(res, { message: "Users fetched successfully", data: users.map(publicUser) });
  } catch (error) {
    next(error);
  }
}

async function createSuperAdmin() {
  try {
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
    if (!superAdminEmail || !superAdminPassword) return;
    const existingAdmin = await User.findOne({
      where: { email: superAdminEmail, role: "SuperAdmin" },
    });
    if (existingAdmin) return;
    const hashedPassword = await bcrypt.hash(superAdminPassword, 10);
    await User.create({
      username: "SuperAdmin",
      email: superAdminEmail,
      password: hashedPassword,
      role: "SuperAdmin",
      verified: true,
    });
    console.log("Super admin account created successfully.");
  } catch (err) {
    console.error("Error creating super admin:", err);
  }
}

module.exports = {
  signup,
  AdminSignup,
  verifyOtp,
  verifyEmail,
  resendVerificationCode,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
  updateMe,
  changePassword,
  deleteMe,
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  createSuperAdmin,
  getUsersById,
  approveUser,
  getUsers,
};
