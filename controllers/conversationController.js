const Conversation = require('../models/Conversation');

// Function to handle clicking "Contact Seller"
const getOrCreateConversation = async (req, res) => {
  try {
    const { sellerId, plotId } = req.body;
    const buyerId = req.user._id; // Assuming you have user authentication middleware setting req.user

    // 1. Check if a conversation already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [buyerId, sellerId] },
      plotId: plotId
    });

    // 2. If it exists, return it so the frontend can redirect to the chat page
    if (conversation) {
      return res.status(200).json(conversation);
    }

    // 3. If it does NOT exist, create a new one
    const newConversation = new Conversation({
      participants: [buyerId, sellerId],
      plotId: plotId
    });

    const savedConversation = await newConversation.save();
    res.status(201).json(savedConversation);

  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ message: "Server error while starting chat" });
  }
};

module.exports = { getOrCreateConversation };