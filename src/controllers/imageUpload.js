const fs = require('fs').promises;
const path = require('path');

// Upload and save custom image
async function uploadCustomImage(req, res) {
  console.log('=== Upload Custom Image Called ===');
  console.log('Request body keys:', Object.keys(req.body));
  console.log('Has imageBase64:', !!req.body.imageBase64);
  console.log('Has description:', !!req.body.description);
  console.log('Has originalFileName:', !!req.body.originalFileName);
  
  try {
    const { imageBase64, description, originalFileName } = req.body;
    
    if (!imageBase64 || !description) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Image data and description are required' 
      });
    }
    
    console.log('Description length:', description.length);
    console.log('ImageBase64 length:', imageBase64.length);
    console.log('Original filename:', originalFileName);
    
    // Extract the base64 data and mime type
    const matches = imageBase64.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches) {
      console.log('Invalid image format');
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid image format' 
      });
    }
    
    const imageType = matches[1]; // jpg, png, gif, etc.
    const base64Data = matches[2];
    
    console.log('Image type:', imageType);
    console.log('Base64 data length:', base64Data.length);
    
    // Use original filename if provided, otherwise generate one
    let filename;
    if (originalFileName) {
      // Sanitize filename to prevent directory traversal
      filename = path.basename(originalFileName);
    } else {
      const timestamp = Date.now();
      filename = `custom_${timestamp}.${imageType}`;
    }
    
    // Define paths
    const imagesDir = path.join(__dirname, '../../data/images');
    const imagePath = path.join(imagesDir, filename);
    const jsonPath = path.join(imagesDir, 'images.json');
    
    // Convert base64 to buffer and save
    const imageBuffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(imagePath, imageBuffer);
    
    console.log(`Image saved: ${filename}`);
    
    // Read current images.json
    let images = [];
    try {
      const jsonData = await fs.readFile(jsonPath, 'utf8');
      images = JSON.parse(jsonData);
    } catch (error) {
      console.log('Creating new images.json file');
      images = [];
    }
    
    // Check if image already exists in images.json
    const existingIndex = images.findIndex(img => img.title === filename);
    
    if (existingIndex !== -1) {
      // Update existing entry
      console.log(`Updating existing entry for: ${filename}`);
      images[existingIndex].description = description;
    } else {
      // Add new image entry
      console.log(`Adding new entry for: ${filename}`);
      const newImageEntry = {
        title: filename,
        description: description
      };
      images.push(newImageEntry);
    }
    
    // Save updated images.json
    await fs.writeFile(jsonPath, JSON.stringify(images, null, 2), 'utf8');
    
    console.log('images.json updated');
    
    res.json({ 
      success: true, 
      message: 'Image uploaded and saved successfully',
      imageTitle: filename
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to upload image: ' + error.message 
    });
  }
}

module.exports = {
  uploadCustomImage
};
