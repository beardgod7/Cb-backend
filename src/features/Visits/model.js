const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbconfig");

const VisitRequest = sequelize.define(
  "VisitRequest",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    resourceType: {
      type: DataTypes.ENUM("library", "archive"),
      allowNull: false,
    },
    resourceId: { type: DataTypes.STRING, allowNull: true },
    resourceTitle: { type: DataTypes.STRING, allowNull: true },
    visitDate: { type: DataTypes.DATEONLY, allowNull: false },
    note: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.ENUM("pending", "approved", "declined", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    adminNote: { type: DataTypes.STRING, allowNull: true },
    reviewedAt: { type: DataTypes.DATE, allowNull: true },
    reviewedBy: { type: DataTypes.UUID, allowNull: true },
  },
  { tableName: "VisitRequests", timestamps: true }
);

// Single-row settings.
const VisitSettings = sequelize.define(
  "VisitSettings",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
    // Weekday numbers that are open (0=Sun..6=Sat). Default Mon–Fri.
    openWeekdays: { type: DataTypes.JSONB, allowNull: false, defaultValue: [1, 2, 3, 4, 5] },
    closedDates: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] }, // ["YYYY-MM-DD"]
    dailyCapacity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
    leadDays: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  },
  { tableName: "VisitSettings", timestamps: true }
);

module.exports = { VisitRequest, VisitSettings };
