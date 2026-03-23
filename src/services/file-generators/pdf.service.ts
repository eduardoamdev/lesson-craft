import puppeteer from "puppeteer";
import path from "path";
import fs from "fs/promises";

const CHROME_EXECUTABLE_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  process.env.CHROME_EXECUTABLE_PATH ||
  "/usr/bin/chromium-browser";

export interface GeneratePdfOptions {
  imageFileName?: string;
  conversation?: Array<{
    speaker: string;
    gender?: string;
    text: string;
  }>;
  testQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  openQuestion: string;
}

const TMP_IMAGE_DIR = path.join(process.cwd(), "tmp", "image-lesson");

/**
 * Generates a PDF lesson file using Puppeteer.
 * Reads the lesson image, builds styled HTML with test and open questions,
 * launches a headless browser to render the content, and returns the PDF as a Uint8Array.
 * Throws errors if image reading or PDF generation fails.
 *
 * @param {GeneratePdfOptions} options - The lesson data including image file name, test questions, and open question.
 * @returns {Promise<Uint8Array>} The generated PDF file as a byte array.
 */
export async function generatePdf({
  imageFileName,
  conversation,
  testQuestions,
  openQuestion,
}: GeneratePdfOptions): Promise<Uint8Array> {
  let imageBase64 = "";

  if (imageFileName) {
    // Read image as base64
    const imagePath = path.join(TMP_IMAGE_DIR, imageFileName);
    console.log("[PDF] Using image path:", imagePath);
    try {
      const imageData = await fs.readFile(imagePath);
      imageBase64 = imageData.toString("base64");
    } catch (err) {
      console.error("[PDF] Failed to read image file:", err);
      // We can continue without image if conversation exists, or throw if neither
      if (!conversation) throw err;
    }
  }

  // Build HTML
  const html = `
    <html>
      <head>
        <style>
          @page {
            margin-top: 40px;
            margin-right: 32px;
            margin-bottom: 32px;
            margin-left: 32px;
            background: #18181b;
          }
          body {
            font-family: 'Inter', Arial, sans-serif;
            background: #18181b;
            color: #e0e0e6;
            padding: 32px;
            margin: 0;
          }
          h1 {
            color: #4c84ff;
            margin-bottom: 0.5em;
            text-align: center;
          }
          h2, h3 {
            color: #4c84ff;
            margin-bottom: 0.5em;
          }
          img {
            max-width: 100%;
            border-radius: 24px;
            margin-bottom: 32px;
            border: 2px solid #4c84ff;
            box-shadow: 0 4px 24px #4c84ff22;
          }
          .question {
            margin-bottom: 32px;
            padding: 0 0 0 0;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .options {
            margin-left: 24px;
            margin-top: 10px;
          }
          .option {
            padding: 6px 0 6px 12px;
            border-left: 3px solid #333;
            margin-bottom: 4px;
            color: #e0e0e6;
          }
          .correct {
            color: #4cffa3;
            font-weight: bold;
            border-left: 3px solid #4cffa3;
            background: #1a2e23;
          }
          .open-question {
            margin-top: 40px;
            background: #232336;
            padding: 20px 28px;
            border-radius: 18px;
            border-left: 5px solid #4c84ff;
            color: #e0e0e6;
            box-shadow: 0 2px 8px #0002;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .conversation-container {
            margin-bottom: 40px;
          }
          .message {
            margin-bottom: 20px;
            padding: 12px 16px;
            border-radius: 12px;
            max-width: 85%;
            line-height: 1.5;
          }
          .speaker-name {
            font-size: 0.85em;
            font-weight: bold;
            margin-bottom: 4px;
            color: #4c84ff;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .speaker-a {
            background: #27272a;
            border-left: 4px solid #4c84ff;
            margin-right: auto;
          }
          .speaker-b {
            background: #1e1e2d;
            border-right: 4px solid #a78bfa;
            margin-left: auto;
            text-align: right;
          }
          .speaker-b .speaker-name {
            color: #a78bfa;
          }
        </style>
      </head>
      <body>
        <h1>${imageFileName ? "Image" : "Conversation"} Activity</h1>
        ${imageBase64 ? `<img src="data:image/png;base64,${imageBase64}" alt="Lesson Image" />` : ""}

        ${
          conversation && conversation.length > 0
            ? `
          <div class="conversation-container">
            <h2>Conversation</h2>
            ${conversation
              .map(
                (msg, i) => `
              <div class="message ${i % 2 === 0 ? "speaker-a" : "speaker-b"}">
                <div class="speaker-name">${msg.speaker}</div>
                <div class="text">${msg.text}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }
        <h2>${imageFileName ? "Fill in the gaps" : "Test Questions"}</h2>
        ${testQuestions
          .map(
            (q, i) => `
              <div class="question">
                <div><b>${i + 1}.</b> ${q.question}</div>
                <div class="options">
                  ${q.options
                    .map(
                      (opt, idx) =>
                        `<div class="option${idx === q.correctAnswer ? " correct" : ""}">${String.fromCharCode(97 + idx)}) ${opt}</div>`,
                    )
                    .join("")}
                </div>
              </div>
            `,
          )
          .join("")}
        <div class="open-question">
          <h3>Open Question</h3>
          <div>${openQuestion}</div>
        </div>
      </body>
    </html>
  `;

  // Launch Puppeteer and generate PDF
  console.log(
    "[PDF] Launching Puppeteer with executable:",
    CHROME_EXECUTABLE_PATH,
  );
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: CHROME_EXECUTABLE_PATH,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch (err) {
    console.error("[PDF] Failed to launch Puppeteer:", err);
    throw err;
  }
  let page;
  try {
    page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();
    console.log("[PDF] PDF generation successful.");
    return pdfBuffer;
  } catch (err) {
    console.error("[PDF] Error during PDF generation:", err);
    if (browser) await browser.close();
    throw err;
  }
}
