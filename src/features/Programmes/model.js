const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbconfig");

const Programme = sequelize.define(
  "Programme",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    title: { type: DataTypes.STRING, allowNull: false },
    type: {
      type: DataTypes.ENUM("special", "annual"),
      allowNull: false,
      defaultValue: "annual",
    },
    summary: { type: DataTypes.TEXT, allowNull: true },
    coverImage: { type: DataTypes.STRING, allowNull: true },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { tableName: "Programmes", timestamps: true }
);

const ProgrammeEdition = sequelize.define(
  "ProgrammeEdition",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    programmeId: { type: DataTypes.UUID, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: false },
    theme: { type: DataTypes.STRING, allowNull: true },
    summary: { type: DataTypes.TEXT, allowNull: true },
    dates: { type: DataTypes.JSONB, allowNull: true }, // { start, end }
    heroImage: { type: DataTypes.STRING, allowNull: true },
    gallery: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] }, // [{url,thumbUrl,caption,width,height}]
    isPublished: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  {
    tableName: "ProgrammeEditions",
    timestamps: true,
    indexes: [{ unique: true, fields: ["programmeId", "year"] }],
  }
);

Programme.hasMany(ProgrammeEdition, { foreignKey: "programmeId", as: "editions" });
ProgrammeEdition.belongsTo(Programme, { foreignKey: "programmeId", as: "programme" });

module.exports = { Programme, ProgrammeEdition };
