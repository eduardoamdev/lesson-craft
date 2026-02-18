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
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

// Function to synthesize speech for a single text with a specific voice
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

async function callTelnyxAPI() {
  const apiKey = process.env.TELNYX_API_KEY;
  const maleVoice = 'Telnyx.NaturalHD.andersen_johan';
  const femaleVoice = 'Telnyx.NaturalHD.astra';

  // Supermarket conversation - 8 messages, 4 each
  const conversation = [
    { speaker: 'Customer', voice: femaleVoice, text: 'Excuse me, where can I find the milk?' },
    { speaker: 'Employee', voice: maleVoice, text: 'The dairy section is in aisle 3, on the left side.' },
    { speaker: 'Customer', voice: femaleVoice, text: 'Thank you! And do you have any fresh bread?' },
    { speaker: 'Employee', voice: maleVoice, text: 'Yes, we have fresh bread at the bakery section, right at the back of the store.' },
    { speaker: 'Customer', voice: femaleVoice, text: 'Perfect! Is there a special offer on fruits today?' },
    { speaker: 'Employee', voice: maleVoice, text: 'Actually, yes! We have a buy two get one free deal on apples and oranges.' },
    { speaker: 'Customer', voice: femaleVoice, text: "That's great! I'll take advantage of that. Where do I pay?" },
    { speaker: 'Employee', voice: maleVoice, text: 'The checkout counters are at the front. Have a nice day!' }
  ];

  try {
    const audioDir = path.join(__dirname, 'audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const timestamp = Date.now();
    const tempFiles = [];

    // Generate audio for each line in sequence
    for (let i = 0; i < conversation.length; i++) {
      const line = conversation[i];
      console.log(`\nGenerating audio for ${line.speaker}: "${line.text}"`);
      const audioBuffer = await synthesizeSpeech(line.text, line.voice, apiKey);
      
      // Save individual audio file
      const tempFile = path.join(audioDir, `temp_${timestamp}_${i}.mp3`);
      fs.writeFileSync(tempFile, audioBuffer);
      tempFiles.push(tempFile);
      console.log(`Saved temporary file: ${tempFile}`);
    }

    // Create ffmpeg concat file list
    const concatListPath = path.join(audioDir, `concat_${timestamp}.txt`);
    const concatContent = tempFiles.map(f => `file '${path.basename(f)}'`).join('\n');
    fs.writeFileSync(concatListPath, concatContent);

    // Merge audio files using ffmpeg with re-encoding for smooth transitions
    const outputPath = path.join(audioDir, `supermarket_conversation_${timestamp}.mp3`);
    console.log('\nMerging audio files with ffmpeg...');
    
    await execPromise(`ffmpeg -f concat -safe 0 -i "${concatListPath}" -acodec libmp3lame -b:a 192k "${outputPath}"`, {
      cwd: audioDir
    });

    // Clean up temporary files
    tempFiles.forEach(f => fs.unlinkSync(f));
    fs.unlinkSync(concatListPath);
    
    console.log(`\n✓ Supermarket conversation saved to: ${outputPath}`);
    
    return outputPath;
  } catch (error) {
    console.error('Error generating audio:', error.message);
    throw error;
  }
}

callTelnyxAPI();
