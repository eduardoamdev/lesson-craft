const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs').promises;

// Store PDF metadata in memory (in production, use a database)
const pdfStore = new Map();

// Helper function to convert image to base64
async function imageToBase64(imageTitle) {
  try {
    const imagePath = path.join(__dirname, '../../data/images', imageTitle);
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const ext = path.extname(imageTitle).toLowerCase();
    let mimeType = 'image/jpeg';
    
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.gif') mimeType = 'image/gif';
    else if (ext === '.webp') mimeType = 'image/webp';
    
    return `data:${mimeType};base64,${base64Image}`;
  } catch (error) {
    console.error('Error reading image:', error);
    return null;
  }
}

// Helper function to format activity content as HTML
async function formatActivityAsHTML(content, imageTitle = null) {
  let cleanContent = content.trim();
  cleanContent = cleanContent.replace(/^```json\s*/i, '');
  cleanContent = cleanContent.replace(/^```\s*/i, '');
  cleanContent = cleanContent.replace(/```\s*$/i, '');
  cleanContent = cleanContent.trim();
  
  try {
    const data = JSON.parse(cleanContent);
    const activityContent = data.tasks || data.exercises || data.activity_components || data;
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1 {
            color: #667eea;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 30px;
          }
          .section {
            margin-bottom: 30px;
          }
          .section h2 {
            color: #764ba2;
            margin-bottom: 15px;
            font-size: 1.3em;
          }
          .question {
            margin-bottom: 20px;
            padding: 15px;
            background: #f9f9f9;
            border-left: 4px solid #667eea;
            border-radius: 4px;
          }
          .question-text {
            font-weight: 600;
            margin-bottom: 10px;
            font-size: 1.1em;
          }
          .options {
            list-style: none;
            padding-left: 20px;
          }
          .options li {
            padding: 8px;
            margin-bottom: 5px;
            background: white;
            border-radius: 4px;
          }
          .correct {
            background: #d4edda !important;
            font-weight: bold;
            color: #155724;
          }
          .open-question {
            padding: 20px;
            background: #f0f0f0;
            border-radius: 8px;
            line-height: 1.6;
          }
          .activity-image {
            text-align: center;
            margin: 30px 0;
          }
          .activity-image img {
            max-width: 100%;
            max-height: 400px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .timestamp {
            text-align: center;
            color: #999;
            font-size: 0.9em;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
          }
        </style>
      </head>
      <body>
        <h1>🎓 Lesson Craft Activity</h1>
    `;
    
    // Add image if provided
    if (imageTitle) {
      const base64Image = await imageToBase64(imageTitle);
      if (base64Image) {
        html += `
          <div class="activity-image">
            <img src="${base64Image}" alt="Activity Image" />
          </div>
        `;
      }
    }
    
    // Multiple choice sentences
    const multiChoice = activityContent.multiple_choice_blanks || 
                       activityContent.multiple_choice_sentences || 
                       data.multiple_choice_sentences || 
                       data.multiple_choice_blanks;
    
    if (multiChoice && multiChoice.length > 0) {
      html += '<div class="section"><h2>Multiple Choice Questions</h2>';
      multiChoice.forEach((item, index) => {
        html += `<div class="question">
          <div class="question-text">${index + 1}. ${item.sentence}</div>
          <ul class="options">`;
        
        item.options.forEach((option, optIndex) => {
          let isCorrect = false;
          if (typeof item.correct_option === 'number') {
            isCorrect = optIndex === item.correct_option;
          } else if (typeof item.correct_option === 'string') {
            isCorrect = option === item.correct_option;
          }
          
          const correctClass = isCorrect ? 'correct' : '';
          html += `<li class="${correctClass}">
            ${String.fromCharCode(97 + optIndex)}) ${option}
            ${isCorrect ? ' ✓' : ''}
          </li>`;
        });
        
        html += '</ul></div>';
      });
      html += '</div>';
    }
    
    // Open question
    const openQ = activityContent.open_question || data.open_question;
    if (openQ) {
      html += '<div class="section"><h2>Open Question</h2><div class="open-question">';
      if (typeof openQ === 'string') {
        html += `<p>${openQ}</p>`;
      } else if (openQ.question) {
        html += `<p><strong>${openQ.question}</strong></p>`;
        if (openQ.guidance) {
          html += `<p><em>Guidance: ${openQ.guidance}</em></p>`;
        }
      }
      html += '</div></div>';
    }
    
    html += `
        <div class="timestamp">
          Generated on ${new Date().toLocaleString()}
        </div>
      </body>
      </html>
    `;
    
    return html;
  } catch (e) {
    throw new Error(`Failed to format activity content: ${e.message}`);
  }
}

// Generate PDF from activity data
async function generatePDF(req, res) {
  try {
    const { activityContent, activityId, imageTitle } = req.body;
    
    if (!activityContent) {
      return res.status(400).json({ 
        success: false, 
        message: 'Activity content is required' 
      });
    }
    
    // Generate unique ID if not provided
    const pdfId = activityId || `activity_${Date.now()}`;
    
    // Format content as HTML
    console.log('Formatting activity content...');
    console.log('Image title:', imageTitle);
    const htmlContent = await formatActivityAsHTML(activityContent, imageTitle);
    console.log('HTML content length:', htmlContent.length);
    console.log('HTML preview:', htmlContent.substring(0, 200));
    
    // Launch puppeteer and generate PDF
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/google-chrome',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });
    
    // Generate PDF buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
      printBackground: true,
      preferCSSPageSize: false
    });
    
    await browser.close();
    
    // Verify PDF buffer is valid
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error('Generated PDF buffer is empty');
    }
    
    console.log('PDF generated successfully, buffer size:', pdfBuffer.length);
    
    // Store PDF in memory (with timestamp for cleanup)
    pdfStore.set(pdfId, {
      buffer: pdfBuffer,
      createdAt: Date.now(),
      filename: `lesson_craft_activity_${pdfId}.pdf`
    });
    
    // Optional: Clean up old PDFs (older than 1 hour)
    cleanupOldPDFs();
    
    res.json({ 
      success: true, 
      message: 'PDF generated successfully',
      pdfId: pdfId
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate PDF: ' + error.message 
    });
  }
}

// Download generated PDF
async function downloadPDF(req, res) {
  try {
    const { pdfId } = req.params;
    
    if (!pdfStore.has(pdfId)) {
      return res.status(404).json({ 
        success: false, 
        message: 'PDF not found. It may have expired.' 
      });
    }
    
    const pdfData = pdfStore.get(pdfId);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfData.filename}"`);
    res.setHeader('Content-Length', pdfData.buffer.length);
    res.setHeader('Cache-Control', 'no-cache');
    res.end(pdfData.buffer, 'binary');
    
  } catch (error) {
    console.error('Error downloading PDF:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to download PDF' 
    });
  }
}

// Check if PDF exists
function checkPDF(req, res) {
  const { pdfId } = req.params;
  
  const exists = pdfStore.has(pdfId);
  res.json({ 
    exists,
    pdfId 
  });
}

// Cleanup old PDFs (older than 1 hour)
function cleanupOldPDFs() {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  
  for (const [key, value] of pdfStore.entries()) {
    if (value.createdAt < oneHourAgo) {
      pdfStore.delete(key);
    }
  }
}

module.exports = {
  generatePDF,
  downloadPDF,
  checkPDF
};
