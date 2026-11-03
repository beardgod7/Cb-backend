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
      comment: "Naira (whole number). Kobo conversion stays inside the server.",
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
      type: DataTypes.ENUM(
        "event",
        "tour",
        "trip",
        "film",
        "library",
        "merchandise",
        "bookstore",
        "museum"
      ),
      allowNull: false,
    },
    bookingId: {
      type: DataTypes.STRING,
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
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
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

// Bank-transfer notices (manual confirmation flow)
const TransferNotice = sequelize.define(
  "TransferNotice",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: { type: DataTypes.UUID, allowNull: false },
    bookingType: { type: DataTypes.STRING, allowNull: false },
    bookingId: { type: DataTypes.STRING, allowNull: false },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Copied from the booking/order, not from the client",
    },
    senderBank: { type: DataTypes.STRING, allowNull: true },
    senderName: { type: DataTypes.STRING, allowNull: true },
    proofUrl: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    adminNote: { type: DataTypes.STRING, allowNull: true },
    reviewedAt: { type: DataTypes.DATE, allowNull: true },
    reviewedBy: { type: DataTypes.UUID, allowNull: true },
  },
  {
    tableName: "TransferNotices",
    timestamps: true,
  }
);

// Single-row settings (bank details shown on the payment screen).
const PaymentSettings = sequelize.define(
  "PaymentSettings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: 1,
    },
    accountName: { type: DataTypes.STRING, allowNull: true },
    bankName: { type: DataTypes.STRING, allowNull: true },
    accountNumber: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "PaymentSettings",
    timestamps: true,
  }
);

module.exports = { Payment, TransferNotice, PaymentSettings };
