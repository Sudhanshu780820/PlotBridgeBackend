// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();

// Import your controller functions
const { getDashboardStats, getMylistings } = require("../controllers/dashboardController");

// Import your authentication middleware (update the path if yours is named differently)
const authMiddleware = require("../middleware/authMiddleware"); 

// Link the URLs to the controllers
router.get("/stats", authMiddleware, getDashboardStats);
router.get("/my-listings", authMiddleware, getMylistings);

module.exports = router;