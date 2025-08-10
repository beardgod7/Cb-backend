const { Sequelize } = require("sequelize");
require("dotenv").config();

const databaseUrl = process.env.DATABASE_URL;

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 50,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully!");

    // 🔄 Auto-sync all defined models
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("All models were synchronized successfully.");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

module.exports = sequelize;
