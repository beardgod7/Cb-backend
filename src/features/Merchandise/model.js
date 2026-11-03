const { DataTypes } = require("sequelize");
const sequelize = require("../../config/dbconfig");

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    category: {
      type: DataTypes.ENUM("artworks", "cultural"),
      allowNull: false,
      defaultValue: "artworks",
    },
    price: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } }, // naira
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
    description: { type: DataTypes.TEXT, allowNull: true },
    images: { type: DataTypes.JSONB, allowNull: true, defaultValue: [] }, // [{url,thumbUrl,width,height}]
    isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    sortOrder: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: "Products", timestamps: true }
);

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    status: {
      type: DataTypes.ENUM(
        "pending_payment",
        "awaiting_transfer",
        "paid",
        "dispatched",
        "delivered",
        "cancelled"
      ),
      allowNull: false,
      defaultValue: "pending_payment",
    },
    subtotal: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    tax: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    deliveryFee: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    total: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    delivery: { type: DataTypes.JSONB, allowNull: true },
    paymentReference: { type: DataTypes.STRING, allowNull: true },
    paidAt: { type: DataTypes.DATE, allowNull: true },
    dispatchedAt: { type: DataTypes.DATE, allowNull: true },
    deliveredAt: { type: DataTypes.DATE, allowNull: true },
    cancelledAt: { type: DataTypes.DATE, allowNull: true },
  },
  { tableName: "Orders", timestamps: true }
);

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderId: { type: DataTypes.UUID, allowNull: false, references: { model: Order, key: "id" } },
    productId: { type: DataTypes.UUID, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: true },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    unitPrice: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    lineTotal: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "OrderItems", timestamps: true }
);

const ShopSettings = sequelize.define(
  "ShopSettings",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, defaultValue: 1 },
    salesTax: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 500 },
    deliveryFee: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1200 },
    deliveryFeeOutsideNigeria: { type: DataTypes.INTEGER, allowNull: true },
  },
  { tableName: "ShopSettings", timestamps: true }
);

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

module.exports = { Product, Order, OrderItem, ShopSettings };
