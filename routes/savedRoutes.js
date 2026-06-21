// routes/savedRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const User = require("../models/User");

router.post("/:plotId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { plotId } = req.params;

    await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          savedProperties: plotId,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Property saved",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/:plotId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { plotId } = req.params;

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          savedProperties: plotId,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Property removed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("savedProperties");

    res.status(200).json(user.savedProperties);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = router;