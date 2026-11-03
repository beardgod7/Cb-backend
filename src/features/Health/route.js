const express = require("express");
const router = express.Router();
const sequelize = require("../../config/dbconfig");

/**
 * GET /health — runs SELECT 1 so an uptime monitor can keep the free host awake
 * and detect database outages. Returns 503 if the database can't be reached.
 */
router.get("/", async (req, res) => {
  try {
    await sequelize.query("SELECT 1");
    return res.status(200).json({
      success: true,
      status: "ok",
      database: "up",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(503).json({
      success: false,
      code: "DATABASE_UNAVAILABLE",
      status: "degraded",
      database: "down",
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
