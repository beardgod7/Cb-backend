const bcrypt = require("bcryptjs");

class Userhash {
  static async hashPassword(passwordOrUser) {
    if (typeof passwordOrUser === "string") {
      if (!passwordOrUser.trim()) throw new Error("Password is empty");
      return await bcrypt.hash(passwordOrUser, 10);
    }

    // Sequelize user object
    if (
      passwordOrUser &&
      typeof passwordOrUser === "object" &&
      passwordOrUser.password &&
      passwordOrUser.changed &&
      passwordOrUser.changed("password")
    ) {
      passwordOrUser.password = await bcrypt.hash(passwordOrUser.password, 10);
    }
  }

  static async comparePassword(plainPassword, hashedPassword) {
    if (!hashedPassword) throw new Error("Missing hashed password");
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = Userhash;
