/**
 * Shared response + error helpers for the CBAAC API.
 *
 * Success envelope: { success: true, message, data }
 * Error envelope:   { success: false, code, message, errors? }
 *
 * The frontend reads res.data.data on success and branches on `code` for errors,
 * so the shapes here must stay stable.
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {object} [options]
 * @param {number} [options.status=200]
 * @param {string} [options.message="Success"]
 * @param {*} [options.data=null]
 */
function ok(res, { status = 200, message = "Success", data = null } = {}) {
  return res.status(status).json({ success: true, message, data });
}

/**
 * Send a failure response.
 * @param {import('express').Response} res
 * @param {object} [options]
 * @param {number} [options.status=400]
 * @param {string} [options.code="BAD_REQUEST"]
 * @param {string} [options.message="Request failed"]
 * @param {object} [options.errors] per-field errors
 * @param {*} [options.data] extra data (e.g. { available } for OUT_OF_STOCK)
 */
function fail(
  res,
  {
    status = 400,
    code = "BAD_REQUEST",
    message = "Request failed",
    errors,
    data,
  } = {}
) {
  const body = { success: false, code, message };
  if (errors) body.errors = errors;
  if (data !== undefined) body.data = data;
  return res.status(status).json(body);
}

/**
 * Application error carrying an HTTP status and a stable `code` the UI can branch on.
 * Thrown from controllers/repositories and rendered by the global error handler.
 */
class AppError extends Error {
  /**
   * @param {string} code stable machine code e.g. "PRODUCT_NOT_FOUND"
   * @param {string} message human readable message
   * @param {number} [status=400]
   * @param {object} [extra] { errors?, data? }
   */
  constructor(code, message, status = 400, extra = {}) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    if (extra.errors) this.errors = extra.errors;
    if (extra.data !== undefined) this.data = extra.data;
  }
}

module.exports = { ok, fail, AppError };
