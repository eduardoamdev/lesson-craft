require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const { synthesizeSpeech } = require("../src/utils/audioGenerator");
const fs = require("fs");

// Voices
// astra
// andersen_johan

const API_KEY = process.env.TELNYX_API_KEY;
const VOICE_ID = "Telnyx.NaturalHD.andersen_johan";
const TEXT = "Hello, this is a test sentence.";

async function main() {
  try {
    if (!API_KEY) {
      throw new Error("TELNYX_API_KEY not set in .env file");
    }
    console.log("Requesting TTS from Telnyx...");
    const audioBuffer = await synthesizeSpeech(TEXT, VOICE_ID, API_KEY);
    fs.writeFileSync("output.mp3", audioBuffer);
    console.log("Audio saved as output.mp3");
  } catch (error) {
    console.error("Error:", error.message || error);
  }
}

main();
