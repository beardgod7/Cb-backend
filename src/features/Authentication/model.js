const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbconfig");
const Userhash = require("../../utils/bcrypt");

// User model
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("Admin", "User", "SuperAdmin"),
      allowNull: false,
      defaultValue: "User",
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "User1",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
    ],
    hooks: {
      beforeCreate: async (user) => {
        await Userhash.hashPassword(user);
      },
    },
  }
);

// Token model for refresh tokens
const Token = sequelize.define(
  "Token",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    token_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "refresh_token",
    },
    expiresIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "Tokens1",
    timestamps: false,
  }
);

module.exports = {
  User,
  Token,
};
