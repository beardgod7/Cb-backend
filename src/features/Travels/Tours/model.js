const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/dbconfig");

const Tour = sequelize.define(
  "Tour",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fullDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pricePerTicket: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    meetingPoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mapLink: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    availableDays: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING(10000)),
      defaultValue: [],
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "Tours",
    timestamps: true,
  }
);

const TourBooking = sequelize.define(
  "TourBooking",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tourId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    selectedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    numberOfTickets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "success", "failed"),
      defaultValue: "pending",
      allowNull: false,
    },
    paymentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    ticketId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    qrCode: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    bookingStatus: {
      type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
      defaultValue: "pending",
      allowNull: false,
    },
  },
  {
    tableName: "TourBookings",
    timestamps: true,
  }
);

const TourInquiry = sequelize.define(
  "TourInquiry",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tourId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "resolved"),
      defaultValue: "pending",
      allowNull: false,
    },
    adminResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "TourInquiries",
    timestamps: true,
  }
);

module.exports = {
  Tour,
  TourBooking,
  TourInquiry,
};
