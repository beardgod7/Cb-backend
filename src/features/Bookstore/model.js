const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbconfig");

const BookstoreBook = sequelize.define(
  "BookstoreBook",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    longDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    numberOfChapters: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    numberOfPages: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    numberOfParts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    editors: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    format: {
      type: DataTypes.ENUM("digital", "physical", "both"),
      allowNull: false,
      defaultValue: "digital",
    },
    fullFileKey: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Private storage key of the full PDF/EPUB. Never returned publicly",
    },
    previewPageLimit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 3,
    },
    pageCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Preview pages can be array of objects {page_title, text}, array of images, or PDF
    previewPages: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: "Can store array of {page_title, text} objects, array of image URLs, or PDF URL",
    },
    previewType: {
      type: DataTypes.ENUM("text", "images", "pdf", "video", "audio"),
      defaultValue: "text",
      allowNull: false,
    },
    coverPage: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      comment: "URL to cover image",
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
    tableName: "BookstoreBooks",
    timestamps: true,
  }
);

const BookstoreCategory = sequelize.define(
  "BookstoreCategory",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  },
  {
    tableName: "BookstoreCategories",
    timestamps: true,
  }
);

const BookstoreBookCategory = sequelize.define(
  "BookstoreBookCategory",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: BookstoreBook,
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: BookstoreCategory,
        key: "id",
      },
    },
  },
  {
    tableName: "BookstoreBookCategories",
    timestamps: true,
  }
);

// Preview/full pages (replaces the single previewContent blob for paged reading).
const BookPage = sequelize.define(
  "BookPage",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    bookId: { type: DataTypes.UUID, allowNull: false, references: { model: BookstoreBook, key: "id" } },
    pageNumber: { type: DataTypes.INTEGER, allowNull: false },
    heading: { type: DataTypes.STRING, allowNull: true },
    body: { type: DataTypes.TEXT, allowNull: true },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
  },
  { tableName: "BookPages", timestamps: true }
);

// A user buys a book once.
const BookPurchase = sequelize.define(
  "BookPurchase",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    bookId: { type: DataTypes.UUID, allowNull: false, references: { model: BookstoreBook, key: "id" } },
    title: { type: DataTypes.STRING, allowNull: true },
    price: { type: DataTypes.INTEGER, allowNull: false },
    status: {
      type: DataTypes.ENUM("pending_payment", "awaiting_transfer", "paid", "refunded"),
      allowNull: false,
      defaultValue: "pending_payment",
    },
    paymentReference: { type: DataTypes.STRING, allowNull: true },
    downloadCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    paidAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "BookPurchases", timestamps: true }
);

// Associations
BookstoreBook.belongsToMany(BookstoreCategory, {
  through: BookstoreBookCategory,
  foreignKey: "bookId",
  as: "categories",
});
BookstoreCategory.belongsToMany(BookstoreBook, {
  through: BookstoreBookCategory,
  foreignKey: "categoryId",
  as: "books",
});

BookstoreBook.hasMany(BookPage, { foreignKey: "bookId", as: "pageRecords" });
BookPage.belongsTo(BookstoreBook, { foreignKey: "bookId", as: "book" });

BookstoreBook.hasMany(BookPurchase, { foreignKey: "bookId", as: "purchases" });
BookPurchase.belongsTo(BookstoreBook, { foreignKey: "bookId", as: "book" });

module.exports = {
  BookstoreBook,
  BookstoreCategory,
  BookstoreBookCategory,
  BookPage,
  BookPurchase,
};