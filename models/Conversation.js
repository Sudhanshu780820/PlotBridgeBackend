const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This links to your existing User schema (buyers and sellers)
        required: true,
      }
    ],
    plotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plot', // Links to your existing Plot schema so they know which land they are discussing
      required: true,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Conversation', conversationSchema);