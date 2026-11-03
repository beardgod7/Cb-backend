const { server } = require("./app");
const sequelize = require("./config/dbconfig");
const { seedArchives } = require("./features/Archives/seed");
const { seedProgrammes } = require("./features/Programmes/seed");

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Run idempotent seeds once the schema is ready.
sequelize
  .authenticate()
  .then(() => seedArchives())
  .then(() => seedProgrammes())
  .catch((err) => console.error("Seed bootstrap error:", err.message));

// Graceful Shutdown Handling
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed gracefully.");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server closed gracefully.");
    process.exit(0);
  });
});
