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
    fullName: {
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
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    purposeOfRental: {
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

// Associations
Artifact.hasMany(RentalRequest, { foreignKey: "artifactId" });
RentalRequest.belongsTo(Artifact, { foreignKey: "artifactId" });

module.exports = {
  Artifact,
  RentalRequest,
  CollaborationRequest,
};
