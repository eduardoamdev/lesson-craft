const express = require('express');
const router = express.Router();
const { generateVideoActivity } = require('../controllers/videoActivityGenerator');

// POST /api/generate-video-activity
router.post('/generate-video-activity', generateVideoActivity);

module.exports = router;
