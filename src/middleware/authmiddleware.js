const jwt = require("jsonwebtoken");

const authenticate = () => async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Access token required!",
    });
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          message: "Your session has expired. Please log in again.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Unauthorized access. Please log in.",
      });
    }

    // Correctly access the data
    req.accessToken = accessToken;
    req.userId = payload.sub;
    req.role = payload.role;
    next();
  });
};

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

module.exports = { authenticate, authorize };
