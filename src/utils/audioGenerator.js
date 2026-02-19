const WebSocket = require('ws');

/**
 * Synthesizes speech for a single text using Telnyx TTS WebSocket API
 * @param {string} text - The text to convert to speech
 * @param {string} voiceId - Telnyx voice ID (e.g., 'Telnyx.NaturalHD.astra')
 * @param {string} apiKey - Telnyx API key
 * @returns {Promise<Buffer>} Audio buffer containing the generated speech
 */
function synthesizeSpeech(text, voiceId, apiKey) {
  const wsUrl = `wss://api.telnyx.com/v2/text-to-speech/speech?voice=${voiceId}`;

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    let audioBuffer = Buffer.alloc(0);
    let stopFrameSent = false;

    ws.on('open', () => {
      console.log(`Connected to Telnyx TTS WebSocket (voice: ${voiceId})`);
      
      // 1. Send initialization frame
      ws.send(JSON.stringify({ text: ' ' }));
      
      // 2. Send text frame
      ws.send(JSON.stringify({ text: text }));
      console.log(`Sent text: "${text}"`);
      
      // 3. Send stop frame after a short delay
      setTimeout(() => {
        if (!stopFrameSent) {
          ws.send(JSON.stringify({ text: '' }));
          stopFrameSent = true;
        }
      }, 1000);
    });

    ws.on('message', (data) => {
      const frame = JSON.parse(data.toString());
      
      if (frame.audio) {
        const audioBytes = Buffer.from(frame.audio, 'base64');
        audioBuffer = Buffer.concat([audioBuffer, audioBytes]);
      }
    });

    ws.on('close', () => {
      console.log(`Connection closed for voice ${voiceId} (${audioBuffer.length} bytes)`);
      resolve(audioBuffer);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error.message);
      reject(error);
    });
  });
}

module.exports = {
  synthesizeSpeech
};
