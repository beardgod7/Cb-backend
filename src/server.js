const { server } = require("./app");
const sequelize = require("./config/dbconfig");
const { seedArchives } = require("./features/Archives/seed");
const { seedProgrammes } = require("./features/Programmes/seed");

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    // dbconfig initializes every registered model and waits for sync({ alter: true }).
    // Seeds must run only after that promise resolves, otherwise their tables may
    // not exist yet on a fresh Render database.
    await sequelize.initializationPromise;
    await seedArchives();
    await seedProgrammes();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exitCode = 1;
  }
}

startServer();

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
