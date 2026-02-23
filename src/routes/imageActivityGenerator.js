const express = require('express');
const router = express.Router();
const { generateImageActivity, renderImageDisplay } = require('../controllers/imageActivityGenerator');


// POST /api/generate-image-activity
router.post('/generate-image-activity', generateImageActivity);

// GET /image-display - show image activity view
router.get('/image-display', renderImageDisplay);

module.exports = router;
