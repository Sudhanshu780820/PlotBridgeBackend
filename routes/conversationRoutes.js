const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Conversation=require('../models/Conversation')

// POST /api/conversations/start
router.post('/start', authMiddleware, async (req, res) => {
  try {
    const { sellerId, plotId } = req.body;
    const buyerId = req.user.id; // Comes from your authMiddleware

    // Create a unique chat room ID combining the buyer, seller, and plot
    // (In the future, you can save this to a MongoDB Conversation model)
    const conversationId = `${buyerId}_${sellerId}_${plotId}`;

    // Send the ID back to React so it can open the ChatPage
    res.status(200).json({ _id: conversationId });
    
  } catch (error) {
    console.error("Error starting conversation:", error);
    res.status(500).json({ message: "Server error starting chat" });
  }
});
// GET /api/conversations
router.get('/', authMiddleware, async (req, res) => {
  try {
    // 1. Safely grab the user ID (handles both common JWT formats)
    const userId = req.user.id || req.user._id;

    // 2. Use $in to safely search inside the participants array
    const conversations = await Conversation.find({ participants: { $in: [userId] } })
      .populate('participants', 'fullName profilePhoto userType') 
      .populate('plotId', 'title location') 
      .sort({ updatedAt: -1 }); 

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Inbox Fetch Error:", error);
    // 3. Send the EXACT error message to the frontend so we can see it!
    res.status(500).json({ 
      message: "Server error fetching inbox", 
      details: error.message 
    });
  }
});

module.exports = router;