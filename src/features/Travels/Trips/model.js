const { DataTypes } = require("sequelize");
const sequelize = require("../../../config/dbconfig");

const Trip = sequelize.define(
  "Trip",
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
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destinationType: {
      type: DataTypes.ENUM("local", "international"),
      allowNull: false,
      defaultValue: "local",
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fullDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    pricePerPerson: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    itinerary: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
    mapLink: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING(10000)),
      defaultValue: [],
      allowNull: true,
    },
    maxParticipants: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    currentBookings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
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
    tableName: "Trips",
    timestamps: true,
  }
);

const TripBooking = sequelize.define(
  "TripBooking",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tripId: {
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
    tableName: "TripBookings",
    timestamps: true,
  }
);

const TripInquiry = sequelize.define(
  "TripInquiry",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tripId: {
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
    tableName: "TripInquiries",
    timestamps: true,
  }
);

module.exports = {
  Trip,
  TripBooking,
  TripInquiry,
};
