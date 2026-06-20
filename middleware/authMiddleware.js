// ...new file...
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_plotbridge";

module.exports = function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach user payload to req.user (same shape used elsewhere)
    req.user = { id: decoded.id, userType: decoded.userType };
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};