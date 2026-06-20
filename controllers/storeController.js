
const Plot = require('../models/Plot');

const createPlot = async (req, res) => {
  try {
    const {
      title,
      price,
      currency,
      category,
      size,
      unit,
      location,
      description,
      lat,
      lng,
      images
    } = req.body;

    const newPlot = new Plot({
      title,
      price,
      currency,
      category,
      size,
      unit,
      location,
      description,
      lat,
      lng,
      images,
      seller: req.user.id
    });

    await newPlot.save();

    res.status(201).json({
      success: true,
      message: "Plot created successfully!",
      plot: newPlot
    });

  } catch (error) {
    console.error("Error creating plot:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createPlot };
