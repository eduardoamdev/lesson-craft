const express = require('express');
const router = express.Router();
const { uploadCustomImage } = require('../controllers/imageUpload');

// POST /api/upload-custom-image - Upload and save a custom image
router.post('/upload-custom-image', uploadCustomImage);

module.exports = router;
