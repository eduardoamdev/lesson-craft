import { WebSocket } from "ws";

const defaultVoices = {
  female: process.env.FEMALE_VOICE_ID,
  male: process.env.MALE_VOICE_ID,
};

const apiKey = process.env.AUDIO_GENERATOR_API_KEY;

/**
 * Synthesizes speech for a single text using TTS WebSocket API
 * @param {string} text - The text to convert to speech
 * @param {string} genre - Genre of the voice
 * @returns {Promise<Buffer>} Audio buffer containing the generated speech
 */
function synthesizeSpeech(
  text: string,
  genre: "male" | "female",
): Promise<Buffer> {
  const voiceId = defaultVoices[genre];

  const wsUrl = `wss://api.telnyx.com/v2/text-to-speech/speech?voice=${voiceId}`;

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    let audioBuffer = Buffer.alloc(0);
    let stopFrameSent = false;

    ws.on("open", () => {
      console.log(`Connected to Telnyx TTS WebSocket (voice: ${voiceId})`);

      ws.send(JSON.stringify({ text: " " }));

      ws.send(JSON.stringify({ text: text }));
      console.log(`Sent text: "${text}"`);

      setTimeout(() => {
        if (!stopFrameSent) {
          ws.send(JSON.stringify({ text: "" }));
          stopFrameSent = true;
        }
      }, 1000);
    });

    ws.on("message", (data) => {
      const frame = JSON.parse(data.toString());

      if (frame.audio) {
        const audioBytes = Buffer.from(frame.audio, "base64");
        audioBuffer = Buffer.concat([audioBuffer, audioBytes]);
      }
    });

    ws.on("close", () => {
      console.log(
        `Connection closed for voice ${voiceId} (${audioBuffer.length} bytes)`,
      );
      resolve(audioBuffer);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error.message);
      reject(error);
    });
  });
}

export { synthesizeSpeech };
