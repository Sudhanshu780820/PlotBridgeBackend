// controllers/dashboardController.js
const Plot = require("../models/Plot"); // Assuming you have a Plot/Property model

const getDashboardStats = async (req, res) => {
  try {
    console.log("req.user =", req.user);

    const userId = req.user.id;
    console.log("userId =", userId);

    const totalListings = await Plot.countDocuments({ seller: userId });
    console.log("totalListings =", totalListings);

    const plots = await Plot.find({ seller: userId });
    console.log("plots =", plots);

    res.json({
      totalListings,
      activeListings: 0,
      soldProperties: 0,
      totalViews: 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getMylistings = async (req, res) => {
  try {
    const userId = req.user.id; // Comes from your JWT authentication middleware
    const listings = await Plot.find({ seller: userId }).sort({ createdAt: -1 });
    res.status(200).json({ listings });
  } catch (error) {
    console.error("My Listings Error:", error);
    res.status(500).json({ message: "Error fetching your listings" });
  }};

module.exports = { getDashboardStats, getMylistings };