require('dotenv').config();

// async function callDeepSeekAPI() {
//   const apiKey = process.env.DEEPSEEK_API_KEY;
//   const apiUrl = 'https://api.deepseek.com/v1/chat/completions';

//   // const message = 'We are in the context of a particular English lesson. Free conversation for adults. Between b1 and b2. I want a conversation between two people talking about hard and soft skills. I also want question regaring the conversation. The student will reply to this questions';
//   const message = 'We are in the context of a particular English lesson. The activity is "Comenting the image for. Between b1 and b2. The description of the image is "Five people gathered in an office in what appears to be a work meeting The person in the right is talking at this moment and the rest are paying attention The environment looks kind and relax". I want you to provide the texts for the activity. Three texts for autocompletion related to the image (elaborate the questions according to the description I provided and dont invent). One open question about describing the image by itself. I also want the sentences incomplete with the place of the work replaced by a line and a text with the possible completions down each sentence. I mean, one sentence, one line with options. Don-t repeat answers';

//   try {
//     const response = await fetch(apiUrl, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${apiKey}`
//       },
//       body: JSON.stringify({
//         model: 'deepseek-chat',
//         messages: [
//           {
//             role: 'user',
//             content: [
//               {
//                 type: 'text',
//                 text: message
//               }
//             ]
//           }
//         ],
//         temperature: 1.3
//       })
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       console.error('API Error Details:', errorData);
//       throw new Error(`HTTP error! status: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
//     }

//     const data = await response.json();

//     const answer = data.choices[0].message.content;
    
//     console.log('Answer from DeepSeek:');
//     console.log(answer);
//   } catch (error) {
//     console.error('Error calling DeepSeek API:', error.message);
//   }
// }

// callDeepSeekAPI();

const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

async function callTelnyxAPI() {
  const apiKey = process.env.TELNYX_API_KEY;
  const voiceId = 'Telnyx.NaturalHD.astra';
  const wsUrl = `wss://api.telnyx.com/v2/text-to-speech/speech?voice=${voiceId}`;

  const message = 'This is a test text';

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    let audioBuffer = Buffer.alloc(0);
    let audioFrameCount = 0;
    let stopFrameSent = false;

    ws.on('open', () => {
      console.log('Connected to Telnyx TTS WebSocket');
      
      // 1. Send initialization frame
      ws.send(JSON.stringify({ text: ' ' }));
      console.log('Sent: Initialization frame');
      
      // 2. Send text frame
      ws.send(JSON.stringify({ text: message }));
      console.log('Sent: Text frame');
      
      // 3. Send stop frame after a short delay to let all text be processed
      setTimeout(() => {
        if (!stopFrameSent) {
          ws.send(JSON.stringify({ text: '' }));
          console.log('Sent: Stop frame');
          stopFrameSent = true;
        }
      }, 1000);
    });

    ws.on('message', (data) => {
      const frame = JSON.parse(data.toString());
      
      if (frame.audio) {
        audioFrameCount++;
        const audioBytes = Buffer.from(frame.audio, 'base64');
        audioBuffer = Buffer.concat([audioBuffer, audioBytes]);
        
        console.log(`Received: Audio frame #${audioFrameCount} (${audioBytes.length} bytes)`);
      }
    });

    ws.on('close', () => {
      console.log('Connection closed');
      console.log(`Total audio buffer size: ${audioBuffer.length} bytes`);
      
      // Save buffer to mp3 file in audio folder
      const audioDir = path.join(__dirname, 'audio');
      if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
      }
      
      const timestamp = Date.now();
      const audioPath = path.join(audioDir, `tts_${timestamp}.mp3`);
      fs.writeFileSync(audioPath, audioBuffer);
      
      console.log(`Audio saved to: ${audioPath}`);
      resolve(audioBuffer);
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error.message);
      reject(error);
    });
  });
}

callTelnyxAPI();
