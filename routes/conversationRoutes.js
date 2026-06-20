const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

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
// GET /api/conversations (Fetch all chats for the logged-in user)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all conversations where this user's ID is in the participants array
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'fullName profilePhoto userType') // Grab the names and photos of the people
      .populate('plotId', 'title location') // Grab the title of the plot they are discussing
      .sort({ updatedAt: -1 }); // Sort by most recently active

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Server error fetching inbox" });
  }
});

module.exports = router;