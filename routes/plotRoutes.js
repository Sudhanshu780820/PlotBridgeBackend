const express = require('express');
const router = express.Router();
const Plot = require('../models/Plot');
const upload = require('../config/multer');
const cloudinary = require('cloudinary').v2;

const fs = require('fs');
const path = require('path');

const authMiddleware = require('../middleware/authMiddleware');
// routes/plotRouter.js

const { createPlot } = require('../controllers/storeController');

router.post( '/', authMiddleware,createPlot );



// GET route to fetch ONLY the logged-in user's listings
router.get('/my-listings', authMiddleware, async (req, res) => {
  try {
    // req.user.id is securely provided by your authMiddleware
    const myPlots = await Plot.find({ seller: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: myPlots });
  } catch (error) {
    console.error("Error fetching user's listings:", error);
    res.status(500).json({ success: false, message: 'Server Error while fetching listings' });
  }
});

router.get('/dashboard-stats', authMiddleware, async (req, res) => {
  try {
    // 1. Find all plots that belong to this specific user
    const sellerId = req.user.id; 
    const myPlots = await Plot.find({ seller: sellerId });

    // 2. Calculate the metrics
    const totalListings = myPlots.length;
    
    const activeListings = myPlots.filter(plot => plot.status === 'Active').length;
    
    const soldProperties = myPlots.filter(plot => plot.status === 'Sold').length;
    
    // Sum up the 'views' field from all plots (defaults to 0 if missing)
    const totalViews = myPlots.reduce((sum, plot) => sum + (plot.views || 0), 0);

    // 3. Send the numbers back to React
    res.status(200).json({
      success: true,
      stats: {
        totalListings,
        activeListings,
        soldProperties,
        totalViews
      }
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// GET route to fetch all plots
router.get('/', async (req, res) => {
  try {
    const plots = await Plot.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: plots });
  } catch (error) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
});
router.get('/:id', async (req, res) => {
    try {
        const plot = await Plot.findByIdAndUpdate(req.params.id,
          { $inc: { views: 1 } },
          { new: true }
        );
        
        if (!plot) {
            return res.status(404).json({ message: 'Plot not found' });
        }

        res.json(plot);
    } catch (error) {
        console.error("Error fetching plot:", error);
        // Handle invalid MongoDB ObjectIds
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Plot not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});
// DELETE /api/plots/:id
// DELETE /api/plots/:id
router.delete('/:id', async (req, res) => {
    try {
        // 1. Find the plot FIRST
        const plot = await Plot.findById(req.params.id);
        
        if (!plot) {
            return res.status(404).json({ message: 'Plot not found' });
        }

        // 2. Delete the images from Cloudinary
        if (plot.images && plot.images.length > 0) {
            for (const imageUrl of plot.images) {
                try {
                    // Extract the public_id from the secure Cloudinary URL
                    // Example URL: https://res.cloudinary.com/.../PlotBridge/Plots/abc123.jpg
                    // We need to extract: PlotBridge/Plots/abc123
                    
                    const startIndex = imageUrl.indexOf('PlotBridge/');
                    if (startIndex !== -1) {
                        const publicIdWithExtension = imageUrl.substring(startIndex);
                        const publicId = publicIdWithExtension.split('.')[0]; // Remove .jpg/.png
                        
                        // Tell Cloudinary to destroy the file
                        await cloudinary.uploader.destroy(publicId);
                    }
                } catch (imgErr) {
                    console.error("Failed to delete image from Cloudinary:", imgErr);
                    // We don't throw an error here, we still want to delete the plot from the DB
                }
            }
        }

        // 3. NOW delete the record from MongoDB
        await Plot.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Plot and Cloudinary images deleted successfully', id: req.params.id });
    } catch (error) {
        console.error("Error deleting plot:", error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Plot not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});
// PUT /api/plots/:id
router.put('/:id', async (req, res) => {
    try {
        // Find the plot by ID and update it with whatever data is sent in req.body
        const updatedPlot = await Plot.findByIdAndUpdate(
            req.params.id,
            req.body, // This contains the new title, price, description, etc.
            { new: true, runValidators: true } // runValidators ensures the new data still matches your schema rules
        );
        
        if (!updatedPlot) {
            return res.status(404).json({ message: 'Plot not found' });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Plot updated successfully', 
            data: updatedPlot 
        });
        
    } catch (error) {
        console.error("Error updating plot:", error);
        res.status(500).json({ message: 'Server Error during update' });
    }
});
module.exports = router;