const express = require('express');
const router = express.Router();
const { generateConversation } = require('../controllers/conversationGenerator');

// POST /api/generate-conversation
router.post('/generate-conversation', generateConversation);

module.exports = router;
