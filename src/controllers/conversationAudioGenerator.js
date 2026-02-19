const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const { synthesizeSpeech } = require('../utils/audioGenerator');

const execPromise = promisify(exec);

// Store audio files temporarily in memory with their metadata
const audioStore = new Map();

// Telnyx API key from environment
const TELNYX_API_KEY = process.env.TELNYX_API_KEY;

// Audio directory
const AUDIO_DIR = path.join(__dirname, '..', '..', 'data', 'audio');

// Ensure audio directory exists
if (!fsSync.existsSync(AUDIO_DIR)) {
  fsSync.mkdirSync(AUDIO_DIR, { recursive: true });
}

/**
 * Generate audio for a conversation activity
 */
async function generateConversationAudio(req, res) {
  try {
    const { conversation, audioId } = req.body;
    
    if (!conversation || !Array.isArray(conversation)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Conversation array is required' 
      });
    }
    
    if (!TELNYX_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        message: 'Telnyx API key not configured' 
      });
    }
    
    const finalAudioId = audioId || `conversation_${Date.now()}`;
    const timestamp = Date.now();
    const tempFiles = [];
    
    console.log(`Generating audio for conversation (${conversation.length} exchanges)...`);
    
    // Generate audio for each conversation exchange
    for (let i = 0; i < conversation.length; i++) {
      const exchange = conversation[i];
      
      if (!exchange.text || !exchange.voice) {
        console.warn(`Skipping exchange ${i}: missing text or voice`);
        continue;
      }
      
      console.log(`\nGenerating audio ${i + 1}/${conversation.length}: ${exchange.speaker}`);
      console.log(`Voice: ${exchange.voice}`);
      console.log(`Text: ${exchange.text.substring(0, 50)}...`);
      
      try {
        const audioBuffer = await synthesizeSpeech(
          exchange.text, 
          exchange.voice, 
          TELNYX_API_KEY
        );
        
        // Save individual audio file
        const tempFile = path.join(AUDIO_DIR, `temp_${timestamp}_${i}.mp3`);
        await fs.writeFile(tempFile, audioBuffer);
        tempFiles.push(tempFile);
        console.log(`✓ Saved temporary file: ${path.basename(tempFile)}`);
      } catch (error) {
        console.error(`Error generating audio for exchange ${i}:`, error);
        // Clean up temp files created so far
        await cleanupTempFiles(tempFiles);
        throw new Error(`Failed to generate audio for exchange ${i}: ${error.message}`);
      }
    }
    
    if (tempFiles.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No valid conversation exchanges to process' 
      });
    }
    
    // Create ffmpeg concat file list
    const concatListPath = path.join(AUDIO_DIR, `concat_${timestamp}.txt`);
    const concatContent = tempFiles.map(f => `file '${path.basename(f)}'`).join('\n');
    await fs.writeFile(concatListPath, concatContent);
    
    // Merge audio files using ffmpeg
    const outputFilename = `conversation_${finalAudioId}.mp3`;
    const outputPath = path.join(AUDIO_DIR, outputFilename);
    
    console.log('\nMerging audio files with ffmpeg...');
    
    try {
      await execPromise(
        `ffmpeg -f concat -safe 0 -i "${concatListPath}" -acodec libmp3lame -b:a 192k "${outputPath}"`,
        { cwd: AUDIO_DIR }
      );
      console.log('✓ Audio files merged successfully');
    } catch (error) {
      console.error('FFmpeg error:', error);
      await cleanupTempFiles(tempFiles);
      await fs.unlink(concatListPath).catch(() => {});
      throw new Error('Failed to merge audio files: ' + error.message);
    }
    
    // Clean up temporary files
    await cleanupTempFiles(tempFiles);
    await fs.unlink(concatListPath).catch(() => {});
    
    console.log(`✓ Conversation audio saved: ${outputFilename}`);
    
    // Store audio metadata
    audioStore.set(finalAudioId, {
      filepath: outputPath,
      filename: outputFilename,
      createdAt: Date.now()
    });
    
    // Schedule cleanup for old audio files
    cleanupOldAudioFiles();
    
    res.json({ 
      success: true, 
      message: 'Audio generated successfully',
      audioId: finalAudioId
    });
    
  } catch (error) {
    console.error('Error generating conversation audio:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate audio: ' + error.message 
    });
  }
}

/**
 * Download generated conversation audio
 */
async function downloadConversationAudio(req, res) {
  try {
    const { audioId } = req.params;
    
    const audioData = audioStore.get(audioId);
    
    if (!audioData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Audio not found or expired' 
      });
    }
    
    // Check if file exists
    const fileExists = await fs.access(audioData.filepath)
      .then(() => true)
      .catch(() => false);
    
    if (!fileExists) {
      audioStore.delete(audioId);
      return res.status(404).json({ 
        success: false, 
        message: 'Audio file not found' 
      });
    }
    
    console.log(`Downloading audio: ${audioData.filename}`);
    
    res.download(audioData.filepath, audioData.filename, (err) => {
      if (err) {
        console.error('Error downloading audio:', err);
        if (!res.headersSent) {
          res.status(500).json({ 
            success: false, 
            message: 'Failed to download audio' 
          });
        }
      }
    });
    
  } catch (error) {
    console.error('Error downloading conversation audio:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to download audio: ' + error.message 
    });
  }
}

/**
 * Check if audio exists for a given audioId
 */
function checkConversationAudio(req, res) {
  const { audioId } = req.params;
  const exists = audioStore.has(audioId);
  
  res.json({ exists });
}

/**
 * Clean up temporary audio files
 */
async function cleanupTempFiles(files) {
  for (const file of files) {
    try {
      await fs.unlink(file);
      console.log(`Cleaned up temp file: ${path.basename(file)}`);
    } catch (error) {
      console.warn(`Failed to cleanup temp file ${file}:`, error.message);
    }
  }
}

/**
 * Clean up old audio files (older than 1 hour)
 */
async function cleanupOldAudioFiles() {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  
  // Clean up tracked conversation files
  for (const [audioId, audioData] of audioStore.entries()) {
    if (audioData.createdAt < oneHourAgo) {
      // Delete file from disk
      fs.unlink(audioData.filepath)
        .then(() => {
          console.log(`Cleaned up old audio file: ${audioData.filename}`);
        })
        .catch((error) => {
          console.warn(`Failed to delete old audio file ${audioData.filename}:`, error.message);
        });
      
      // Remove from store
      audioStore.delete(audioId);
    }
  }
  
  // Also clean up any orphaned temp files or concat lists
  try {
    const files = await fs.readdir(AUDIO_DIR);
    const now = Date.now();
    
    for (const file of files) {
      // Check for temp files or concat list files
      if (file.startsWith('temp_') || file.startsWith('concat_')) {
        const filepath = path.join(AUDIO_DIR, file);
        const stats = await fs.stat(filepath);
        const fileAge = now - stats.mtimeMs;
        
        // Delete if older than 1 hour
        if (fileAge > (60 * 60 * 1000)) {
          await fs.unlink(filepath);
          console.log(`Cleaned up orphaned file: ${file}`);
        }
      }
    }
  } catch (error) {
    console.warn('Error during orphaned file cleanup:', error.message);
  }
}

// Schedule periodic cleanup every hour
setInterval(cleanupOldAudioFiles, 60 * 60 * 1000);

module.exports = {
  generateConversationAudio,
  downloadConversationAudio,
  checkConversationAudio
};
