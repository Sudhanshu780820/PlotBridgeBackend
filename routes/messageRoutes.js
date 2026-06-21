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

// 2. GET: Fetch all old messages for a specific chat room
router.get('/:conversationId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    })
      .populate("senderId", "fullName profilePhoto")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Server error fetching messages" });
  }
});

module.exports = router;