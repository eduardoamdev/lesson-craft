const express = require('express');
const router = express.Router();
const { generateImageActivity } = require('../controllers/imageActivityGenerator');

// POST /api/generate-image-activity
router.post('/generate-image-activity', generateImageActivity);

module.exports = router;
