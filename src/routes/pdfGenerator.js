const express = require('express');
const router = express.Router();
const { generatePDF, downloadPDF, checkPDF } = require('../controllers/pdfGenerator');

// POST /api/generate-pdf - Generate a PDF from activity content
router.post('/generate-pdf', generatePDF);

// GET /api/download-pdf/:pdfId - Download the generated PDF
router.get('/download-pdf/:pdfId', downloadPDF);

// GET /api/check-pdf/:pdfId - Check if a PDF exists
router.get('/check-pdf/:pdfId', checkPDF);

module.exports = router;
