const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../../config/dbconfig");

const FormFieldTemplate = sequelize.define(
  "FormFieldTemplate",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    EventId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    isGlobal: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fields: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

// Event booking stores both fixed and dynamic fields
const EventBooking = sequelize.define(
  "EventBooking",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    EventId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    FirstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    LastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Status: {
      type: DataTypes.ENUM("Register", "Volunteer", "Sponsor"),
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: {},
    },
  },
  {
    timestamps: true,
    freezeTableName: true,
  }
);

module.exports = {
  FormFieldTemplate,
  EventBooking,
};
