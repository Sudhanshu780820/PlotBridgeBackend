const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');

// 1. POST: Save a new message to the database
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { conversationId, senderId, text } = req.body;
    
    const newMessage = new Message({
      conversationId,
      senderId,
      text
    });

    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ message: "Server error saving message" });
  }
});


// GET /api/conversations/:id (Fetch a single conversation's details)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'fullName profilePhoto userType')
      .populate('plotId', 'title location price images currency');

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error fetching single conversation:", error);
    res.status(500).json({ message: "Server error fetching conversation details" });
  }
});

module.exports = router;