const jwt = require("jsonwebtoken");

function authorize(requiredRoles = []) {
  return (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({
        success: false,
        code: "NO_TOKEN",
        message: "Access token required.",
      });
    }

    try {
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        process.env.JWT_SECRET
      );

      req.user = decoded; // Store the entire decoded token, not just sub

      if (!decoded.role || !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          code: "INSUFFICIENT_PERMISSIONS",
          message:
            "Forbidden: You do not have permission to perform this action.",
        });
      }

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          code: "TOKEN_EXPIRED",
          message: "Your session has expired. Please log in again.",
        });
      }
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message: "Invalid or malformed token.",
      });
    }
  };
}

module.exports = { authorize };
