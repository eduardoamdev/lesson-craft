const express = require('express');
const router = express.Router();

const { generateImageActivity, renderImageDisplay } = require('../controllers/imageActivityGenerator');
const { renderEditImageActivity, handleEditImageActivity } = require('../controllers/imageEdit');


// POST /api/generate-image-activity
router.post('/generate-image-activity', generateImageActivity);

// GET /image-display - show image activity view
router.get('/image-display', renderImageDisplay);

// GET /image-edit - show edit form for image activity
router.get('/image-edit', renderEditImageActivity);

// POST /image-edit - handle edit form submission
router.post('/image-edit', handleEditImageActivity);

module.exports = router;
