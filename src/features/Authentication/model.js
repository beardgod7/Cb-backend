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
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Legacy; no longer collected on public signup",
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
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
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    profileCompletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Null until step 2 (profession/country/state) is done",
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Soft delete; personal data cleared, orders kept anonymised",
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
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Wrong OTP attempts for this code",
    },
  },
  {
    tableName: "Tokens1",
    timestamps: false,
  }
);

// Billing / delivery addresses (Accounts & Profile spec)
const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    label: { type: DataTypes.STRING, allowNull: true },
    firstName: { type: DataTypes.STRING, allowNull: true },
    lastName: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true },
    state: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    postalCode: { type: DataTypes.STRING, allowNull: true },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "Addresses",
    timestamps: true,
  }
);

User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = {
  User,
  Token,
  Address,
};
