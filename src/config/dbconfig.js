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
    // Keep TCP connections alive so idle sockets aren't silently dropped by the host.
    keepAlive: true,
    // Give up on a connection the client-side considers dead, rather than reusing it.
    statement_timeout: 30000,
  },
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    // Recycle idle connections before the managed Postgres closes them (its idle
    // timeout is higher). This prevents "Connection terminated unexpectedly".
    idle: 10000,
    evict: 5000,
  },
  // Retry a query once when the failure is a dropped/refused connection.
  retry: {
    max: 1,
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotReachableError/,
      /SequelizeConnectionTimedOutError/,
      /Connection terminated unexpectedly/i,
      /ECONNRESET/,
      /ETIMEDOUT/,
    ],
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
