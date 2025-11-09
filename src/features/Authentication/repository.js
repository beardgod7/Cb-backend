const { User, Token } = require("./model");
const { Op, Sequelize } = require("sequelize");

// Create a new user
/**
 * Creates a new user in the database.
 * @param {Object} data - The user data.
 * @returns {Promise<User>} - The newly created user.
 */
async function createUser(data) {
  try {
    const user = await User.create(data);
    return user;
  } catch (error) {
    console.error("Full Error Object:", error);
    if (error.name === "SequelizeValidationError") {
      console.error(
        "Validation error details:",
        error.errors.map((err) => err.message)
      );
    }
    throw error;
  }
}

async function updateUser(userId, updates) {
  try {
    const result = await User.update(updates, {
      where: { id: userId },
      returning: true,
    });
    return result[1][0];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

/**
 * Finds a user by their email.
 * @param {string} email - The user's email.
 * @returns {Promise<User|null>} - The user if found, otherwise null.
 */
async function findUserByEmail(email) {
  return await User.findOne({
    where: {
      email: { [Op.iLike]: email },
    },
  });
}

/**
 * Finds a user by their ID.
 * @param {string} userId - The user's ID.
 * @returns {Promise<User|null>} - The user if found, otherwise null.
 */
async function findUserById(userId) {
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw error;
  }
}

/**
 * Saves the verification code for a user.
 * @param {string} userId - The user's ID.
 * @param {string} code - The verification code.
 * @returns {Promise<Object>} - The saved token record.
 */
async function saveVerificationCode(userId, code) {
  return await Token.create({
    userId,
    token: code,
    token_type: "verify_account",
    expiresIn: Date.now() + 3600000, // 1 hour
  });
}

/**
 * Stores a refresh token in the database.
 * @param {string} userId - The user's ID.
 * @param {string} token - The refresh token.
 * @returns {Promise<Token>} - The created token entry.
 */
async function storeRefreshToken(userId, token) {
  try {
    const newToken = await Token.create({
      userId,
      token,
      token_type: "refresh_token",
    });
    return newToken;
  } catch (error) {
    throw error;
  }
}

/**
 * Finds a refresh token by its token string.
 * @param {string} token - The refresh token.
 * @returns {Promise<Token|null>} - The token entry if found, otherwise null.
 */
async function findRefreshToken(token) {
  try {
    const storedToken = await Token.findOne({
      where: { token, token_type: "refresh_token" },
    });
    if (!storedToken) {
      return null;
    }
    return storedToken;
  } catch (error) {
    throw error;
  }
}
async function getAllUsersWithProfiles() {
  try {
    return await User.findAll({});
  } catch (error) {
    console.error("Error fetching users with profiles:", error);
    throw error;
  }
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  saveVerificationCode,
  storeRefreshToken,
  findRefreshToken,
  updateUser,
  getAllUsersWithProfiles,
  getAllUsersWithProfiles,
};
