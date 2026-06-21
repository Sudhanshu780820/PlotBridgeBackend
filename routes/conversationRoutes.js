const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Conversation=require('../models/Conversation')

// POST /api/conversations/start
router.post('/start', authMiddleware, async (req, res) => {
  try {
    const { sellerId, plotId } = req.body;
    const buyerId = req.user.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [buyerId, sellerId] },
      plotId
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [buyerId, sellerId],
        plotId
      });
    }

    res.status(200).json(conversation);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error starting chat" });
  }
});
// GET /api/conversations
router.get("/:conversationId", authMiddleware, async (req, res) => {
  try {
    const conversation = await Conversation.findById(
      req.params.conversationId
    )
      .populate(
        "participants",
        "fullName profilePhoto userType email"
      )
      .populate(
        "plotId",
        "title location price images category size unit description"
      );

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Conversation Fetch Error:", error);
    res.status(500).json({
      message: "Failed to fetch conversation",
    });
  }
});

module.exports = router;