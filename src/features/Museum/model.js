const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbconfig");

const Artifact = sequelize.define(
  "Artifact",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    identificationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    era: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    yearOrPeriod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    fullDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING(1000)),
      defaultValue: [],
      allowNull: true,
    },
    audioNarration: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    audioDurationSeconds: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Player shows length",
    },
    isRentable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "Hide 'Rent artefact' for items that can't leave the museum",
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
    tableName: "Artifacts",
    timestamps: true,
  }
);

const RentalRequest = sequelize.define(
  "RentalRequest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    artifactId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Artifact,
        key: "id",
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true, // kept for old data; firstName/lastName preferred now
    },
    renterType: {
      type: DataTypes.ENUM("individual", "company", "organisation"),
      allowNull: true,
    },
    organization: {
      type: DataTypes.STRING,
      allowNull: true,
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
      allowNull: true,
    },
    purposeOfRental: {
      type: DataTypes.TEXT,
      allowNull: true, // optional (design doesn't ask)
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    termsAccepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    termsAcceptedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected", "completed"),
      defaultValue: "pending",
      allowNull: false,
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    adminResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "RentalRequests",
    timestamps: true,
  }
);

const CollaborationRequest = sequelize.define(
  "CollaborationRequest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    organization: {
      type: DataTypes.STRING,
      allowNull: true,
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
      type: DataTypes.ENUM("pending", "responded", "in-progress", "completed"),
      defaultValue: "pending",
      allowNull: false,
    },
    adminResponse: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "CollaborationRequests",
    timestamps: true,
  }
);

// Editable Terms & Conditions text (same pattern as Films terms).
const MuseumTerms = sequelize.define(
  "MuseumTerms",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
    version: { type: DataTypes.STRING, allowNull: false, defaultValue: "1.0" },
    body: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: "MuseumTerms", timestamps: true }
);

// Associations
Artifact.hasMany(RentalRequest, { foreignKey: "artifactId" });
RentalRequest.belongsTo(Artifact, { foreignKey: "artifactId" });

module.exports = {
  Artifact,
  RentalRequest,
  CollaborationRequest,
  MuseumTerms,
};
