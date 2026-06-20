const express = require('express');
const router = express.Router();
const { getOrCreateConversation } = require('../controllers/conversationController');
// const { verifyToken } = require('../middleware/auth'); // Make sure the user is logged in!

// POST request because we might be creating new data
router.post('/start', /* verifyToken, */ getOrCreateConversation);

module.exports = router;