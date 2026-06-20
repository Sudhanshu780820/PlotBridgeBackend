// controllers/dashboardController.js
const Plot = require("../models/Plot"); // Assuming you have a Plot/Property model

 const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id; // Comes from your JWT authentication middleware

    // Count properties belonging to this specific user
    const totalListings = await Plot.countDocuments({ seller: userId });
    
    const activeListings = await Plot.countDocuments({ 
      seller: userId, 
      status: "Active" 
    });
    
    const soldProperties = await Plot.countDocuments({ 
      seller: userId, 
      status: "Sold" 
    });

    // Sum all views from the user's plots (Requires a 'views' number field in your Plot model)
    const plots = await Plot.find({ seller: userId }, "views");
    const totalViews = plots.reduce((sum, plot) => sum + (plot.views || 0), 0);

    // Send the data back to the React component
    res.status(200).json({
      totalListings,
      activeListings,
      soldProperties,
      totalViews
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: "Error fetching dashboard stats" });
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

module.exports = { getDashboardStats };