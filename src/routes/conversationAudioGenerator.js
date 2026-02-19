const express = require('express');
const router = express.Router();
const { 
  generateConversationAudio, 
  downloadConversationAudio, 
  checkConversationAudio 
} = require('../controllers/conversationAudioGenerator');

// POST /api/generate-conversation-audio - Generate audio from conversation
router.post('/generate-conversation-audio', generateConversationAudio);

// GET /api/download-conversation-audio/:audioId - Download the generated audio
router.get('/download-conversation-audio/:audioId', downloadConversationAudio);

// GET /api/check-conversation-audio/:audioId - Check if audio exists
router.get('/check-conversation-audio/:audioId', checkConversationAudio);

module.exports = router;
