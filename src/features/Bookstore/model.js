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
    // Preview pages can be array of objects {page_title, text}, array of images, or PDF
    previewPages: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: "Can store array of {page_title, text} objects, array of image URLs, or PDF URL",
    },
    previewType: {
      type: DataTypes.ENUM("text", "images", "pdf"),
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

// Associations
BookstoreBook.belongsToMany(BookstoreCategory, { 
  through: BookstoreBookCategory, 
  foreignKey: "bookId",
  as: "categories"
});
BookstoreCategory.belongsToMany(BookstoreBook, { 
  through: BookstoreBookCategory, 
  foreignKey: "categoryId",
  as: "books"
});

module.exports = {
  BookstoreBook,
  BookstoreCategory,
  BookstoreBookCategory,
};