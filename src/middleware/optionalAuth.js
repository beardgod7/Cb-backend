const jwt = require("jsonwebtoken");

/**
 * Optional authentication: if a valid Bearer token is present, populate
 * req.userId / req.role; otherwise continue as an anonymous request. Never
 * rejects. Used by public endpoints that behave differently for logged-in users
 * (e.g. the bookstore "owned" flag and owner page access).
 */
const optionalAuth = () => (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    req.role = payload.role;
  } catch (_) {
    // ignore invalid/expired token for optional auth
  }
  next();
};

module.exports = { optionalAuth };
