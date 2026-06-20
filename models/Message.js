const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Identifies who sent the text
      required: true,
    },
    text: {
      type: String,
      required: true, // Ensures empty messages aren't sent
    },
    isRead: {
      type: Boolean,
      default: false, // Useful later if you want to add "read receipts"
    }
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Message', messageSchema);