const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startWith("Bearer")
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "User not found, unauthorized" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }
};

module.exports = { protect };
