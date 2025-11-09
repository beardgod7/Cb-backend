const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../../config/dbconfig");

const Events = sequelize.define(
  "Events",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    Title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Organizer: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    Location: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    Images: {
      type: DataTypes.ARRAY(DataTypes.STRING(10000)),
      defaultValue: [],
      allowNull: true,
    },
    Date: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    EventHighlights: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    Status: {
      type: DataTypes.ENUM("past", "upcoming"),
      allowNull: false,
      defaultValue: "upcoming",
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    registrationEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    volunteerEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    eventType: {
      type: DataTypes.ENUM("online", "offline", "hybrid"),
      allowNull: false,
      defaultValue: "offline",
    },
    maxAttendees: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    registrationDeadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },

  },
  {
    tableName: "Events",
    timestamps: true,
  }
);

const Albums = sequelize.define(
  "Albums",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    Title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Images: {
      type: DataTypes.ARRAY(DataTypes.STRING(1000)),
      defaultValue: [],
      allowNull: true,
    },
  },
  {
    tableName: "Albums",
    timestamps: true,
  }
);

module.exports = {
  Events,
  Albums,
};
