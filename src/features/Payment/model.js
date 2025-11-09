const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbconfig");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transactionReference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    paymentGateway: {
      type: DataTypes.ENUM("paystack", "flutterwave", "stripe"),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "NGN",
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed", "refunded"),
      defaultValue: "pending",
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bookingType: {
      type: DataTypes.ENUM("event", "tour", "trip"),
      allowNull: false,
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    tableName: "Payments",
    timestamps: true,
  }
);

module.exports = { Payment };
