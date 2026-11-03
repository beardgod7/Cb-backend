const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbconfig");

const Subscriber = sequelize.define(
  "Subscriber",
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
      set(value) {
        this.setDataValue("email", String(value || "").trim().toLowerCase());
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "active", "unsubscribed"),
      allowNull: false,
      defaultValue: "pending",
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Page the subscription came from, e.g. home, library",
    },
    confirmToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unsubscribeToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    confirmedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    unsubscribedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "Subscribers",
    timestamps: true,
  }
);

module.exports = { Subscriber };
