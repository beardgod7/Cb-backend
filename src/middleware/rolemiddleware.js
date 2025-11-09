const jwt = require("jsonwebtoken");

function authorize(requiredRoles = []) {
  return (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(403).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    try {
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        process.env.JWT_SECRET
      );

      req.user = decoded.sub;

      if (!req.user?.role || !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message:
            "Forbidden: You do not have permission to perform this action.",
        });
      }

      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: "Invalid token.",
      });
    }
  };
}

module.exports = { authorize };
