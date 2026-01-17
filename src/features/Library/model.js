const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbconfig");

const Category = sequelize.define(
  "Category",
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
    tableName: "Categories",
    timestamps: true,
  }
);

const Book = sequelize.define(
  "Book",
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
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    yearOfPublication: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    coverImage: {
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    // Preview pages can be array of objects {page_title, text}, array of images, or PDF
    previewPages: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: "Can store array of {page_title, text} objects, array of image URLs, or PDF URL",
    },
    previewPagesType: {
      type: DataTypes.ENUM("text", "images", "pdf"),
      defaultValue: "text",
      allowNull: false,
    },
    // Table of contents can be array, array of images, or PDF
    tableOfContents: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: "Can store array of content items, array of image URLs, or PDF URL",
    },
    tableOfContentsType: {
      type: DataTypes.ENUM("text", "images", "pdf"),
      defaultValue: "text",
      allowNull: false,
    },
    // Abstract preview can be string, array of images, or PDF
    abstractPreview: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: "Can store string text, array of image URLs, or PDF URL",
    },
    abstractPreviewType: {
      type: DataTypes.ENUM("text", "images", "pdf"),
      defaultValue: "text",
      allowNull: false,
    },
    // Other preview pages
    otherPreviewPages: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: "Additional preview content in various formats",
    },
    otherPreviewPagesType: {
      type: DataTypes.ENUM("text", "images", "pdf"),
      defaultValue: "text",
      allowNull: false,
    },
    // Scheduled date to visit library
    scheduledVisitDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: "Scheduled date for library visit",
    },
    isPreviewVisible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    isMostPopular: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: "Books",
    timestamps: true,
  }
);

const BookCategory = sequelize.define(
  "BookCategory",
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
        model: Book,
        key: "id",
      },
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
  },
  {
    tableName: "BookCategories",
    timestamps: true,
  }
);

const ReadingVisit = sequelize.define(
  "ReadingVisit",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookId: {
      type: DataTypes.UUID,
      allowNull: true,
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
    preferredDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
      defaultValue: "pending",
      allowNull: false,
    },
    adminNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "ReadingVisits",
    timestamps: true,
  }
);

const LibrarianContact = sequelize.define(
  "LibrarianContact",
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: "LibrarianContacts",
    timestamps: true,
  }
);

// Associations
Book.belongsToMany(Category, { through: BookCategory, foreignKey: "bookId" });
Category.belongsToMany(Book, { through: BookCategory, foreignKey: "categoryId" });

module.exports = {
  Category,
  Book,
  BookCategory,
  ReadingVisit,
  LibrarianContact,
};
