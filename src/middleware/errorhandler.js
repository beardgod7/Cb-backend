const { AppError } = require("../utils/apiResponse");

/**
 * Detects a dropped/unavailable Postgres connection so we can return 503
 * DATABASE_UNAVAILABLE instead of a bare 500 (see Site-wide spec).
 */
function isConnectionError(err) {
  const name = err && err.name ? String(err.name) : "";
  const msg = err && err.message ? String(err.message) : "";
  return (
    name === "SequelizeConnectionError" ||
    name === "SequelizeConnectionRefusedError" ||
    name === "SequelizeHostNotFoundError" ||
    name === "SequelizeHostNotReachableError" ||
    name === "SequelizeConnectionTimedOutError" ||
    /connection terminated unexpectedly/i.test(msg) ||
    /ECONNRESET|ETIMEDOUT|ECONNREFUSED/i.test(msg)
  );
}

const errorHandler = (err, req, res, next) => {
  // Explicit application errors with a stable code.
  if (err instanceof AppError) {
    const body = { success: false, code: err.code, message: err.message };
    if (err.errors) body.errors = err.errors;
    if (err.data !== undefined) body.data = err.data;
    return res.status(err.status || 400).json(body);
  }

  // Joi validation errors.
  if (err && err.isJoi) {
    const errors = {};
    for (const detail of err.details || []) {
      const key = detail.path && detail.path.length ? detail.path.join(".") : "_";
      errors[key] = detail.message;
    }
    return res.status(400).json({
      success: false,
      code: "VALIDATION_FAILED",
      message: "Validation failed",
      errors,
    });
  }

  // Sequelize validation / unique constraint errors.
  if (err && err.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      success: false,
      code: "DUPLICATE",
      message: "A record with these details already exists.",
    });
  }
  if (err && err.name === "SequelizeValidationError") {
    const errors = {};
    for (const e of err.errors || []) errors[e.path || "_"] = e.message;
    return res.status(400).json({
      success: false,
      code: "VALIDATION_FAILED",
      message: "Validation failed",
      errors,
    });
  }

  // Dropped database connection -> 503 so the frontend can show "try again".
  if (isConnectionError(err)) {
    console.error("Database connection error:", err.message);
    return res.status(503).json({
      success: false,
      code: "DATABASE_UNAVAILABLE",
      message: "The service is temporarily unavailable. Please try again.",
    });
  }

  console.error(err.stack || err);
  return res.status(err.status || 500).json({
    success: false,
    code: err.code || "INTERNAL_ERROR",
    message: err.message || "Internal Server Error",
  });
};

module.exports = { errorHandler, isConnectionError };
