const express = require('express');
const router = express.Router();
const { renderEditConversation, handleEditConversation } = require('../controllers/conversationEdit');

router.get('/conversation/edit', renderEditConversation);
router.post('/conversation/edit', handleEditConversation);

module.exports = router;
