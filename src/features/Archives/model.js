const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbconfig");

const ArchiveCollection = sequelize.define(
  "ArchiveCollection",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    itemKind: {
      type: DataTypes.ENUM("document", "photoSet", "idCard"),
      allowNull: false,
      defaultValue: "document",
    },
    coverImage: { type: DataTypes.STRING, allowNull: true },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    isPublished: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { tableName: "ArchiveCollections", timestamps: true }
);

const ArchiveSubcategory = sequelize.define(
  "ArchiveSubcategory",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    collectionId: { type: DataTypes.UUID, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: "ArchiveSubcategories", timestamps: true }
);

const ArchiveItem = sequelize.define(
  "ArchiveItem",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    collectionId: { type: DataTypes.UUID, allowNull: false },
    subcategoryId: { type: DataTypes.UUID, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: true },
    typeLabel: { type: DataTypes.STRING, allowNull: true },
    place: { type: DataTypes.STRING, allowNull: true },
    summary: { type: DataTypes.TEXT, allowNull: true },
    thumbnail: { type: DataTypes.STRING, allowNull: true },
    tags: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true, defaultValue: [] },
    // document fields
    authors: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true, defaultValue: [] },
    abstract: { type: DataTypes.TEXT, allowNull: true },
    tableOfContents: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] },
    pageCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    previewPageLimit: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 3 },
    sourceFileUrl: { type: DataTypes.STRING, allowNull: true }, // private, never returned publicly
    // photoSet fields
    photos: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] },
    location: { type: DataTypes.STRING, allowNull: true },
    eventDate: { type: DataTypes.DATEONLY, allowNull: true },
    // idCard fields
    participantName: { type: DataTypes.STRING, allowNull: true },
    country: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.STRING, allowNull: true },
    cardNumber: { type: DataTypes.STRING, allowNull: true },
    photoUrl: { type: DataTypes.STRING, allowNull: true },
    cardScanUrl: { type: DataTypes.STRING, allowNull: true },

    isPublished: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  },
  { tableName: "ArchiveItems", timestamps: true }
);

const ArchivePage = sequelize.define(
  "ArchivePage",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    itemId: { type: DataTypes.UUID, allowNull: false },
    pageNumber: { type: DataTypes.INTEGER, allowNull: false },
    heading: { type: DataTypes.STRING, allowNull: true },
    body: { type: DataTypes.TEXT, allowNull: true },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
  },
  { tableName: "ArchivePages", timestamps: true }
);

// Associations
ArchiveCollection.hasMany(ArchiveSubcategory, { foreignKey: "collectionId", as: "subcategories" });
ArchiveSubcategory.belongsTo(ArchiveCollection, { foreignKey: "collectionId", as: "collection" });

ArchiveCollection.hasMany(ArchiveItem, { foreignKey: "collectionId", as: "items" });
ArchiveItem.belongsTo(ArchiveCollection, { foreignKey: "collectionId", as: "collection" });

ArchiveSubcategory.hasMany(ArchiveItem, { foreignKey: "subcategoryId", as: "items" });
ArchiveItem.belongsTo(ArchiveSubcategory, { foreignKey: "subcategoryId", as: "subcategory" });

ArchiveItem.hasMany(ArchivePage, { foreignKey: "itemId", as: "pageRecords" });
ArchivePage.belongsTo(ArchiveItem, { foreignKey: "itemId", as: "item" });

module.exports = {
  ArchiveCollection,
  ArchiveSubcategory,
  ArchiveItem,
  ArchivePage,
};
