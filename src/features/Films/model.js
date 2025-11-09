const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbconfig");

const Film = sequelize.define(
  "Film",
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
    yearOfRecording: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    festivalYear: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coverImage: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    thumbnailGallery: {
      type: DataTypes.ARRAY(DataTypes.STRING(1000)),
      defaultValue: [],
      allowNull: true,
    },
    previewVideo: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    fullVideo: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    ticketPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "Films",
    timestamps: true,
  }
);

const ScreeningSlot = sequelize.define(
  "ScreeningSlot",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    filmId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Film,
        key: "id",
      },
    },
    screeningDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    maxSeats: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      allowNull: false,
    },
    bookedSeats: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: "ScreeningSlots",
    timestamps: true,
  }
);

const FilmBooking = sequelize.define(
  "FilmBooking",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    filmId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Film,
        key: "id",
      },
    },
    screeningSlotId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: ScreeningSlot,
        key: "id",
      },
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
    numberOfSeats: {
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
      type: DataTypes.ENUM("pending", "confirmed", "cancelled", "completed"),
      defaultValue: "pending",
      allowNull: false,
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    tableName: "FilmBookings",
    timestamps: true,
  }
);

const FilmInquiry = sequelize.define(
  "FilmInquiry",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    filmId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Film,
        key: "id",
      },
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
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "responded", "resolved"),
      defaultValue: "pending",
      allowNull: false,
    },
    adminResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "FilmInquiries",
    timestamps: true,
  }
);

// Associations
Film.hasMany(ScreeningSlot, { foreignKey: "filmId" });
ScreeningSlot.belongsTo(Film, { foreignKey: "filmId" });

Film.hasMany(FilmBooking, { foreignKey: "filmId" });
FilmBooking.belongsTo(Film, { foreignKey: "filmId" });

ScreeningSlot.hasMany(FilmBooking, { foreignKey: "screeningSlotId" });
FilmBooking.belongsTo(ScreeningSlot, { foreignKey: "screeningSlotId" });

Film.hasMany(FilmInquiry, { foreignKey: "filmId" });
FilmInquiry.belongsTo(Film, { foreignKey: "filmId" });

module.exports = {
  Film,
  ScreeningSlot,
  FilmBooking,
  FilmInquiry,
};
