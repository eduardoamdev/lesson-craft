import puppeteer from "puppeteer";
import path from "path";
import fs from "fs/promises";

const CHROME_EXECUTABLE_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  process.env.CHROME_EXECUTABLE_PATH ||
  "/usr/bin/chromium-browser";

export interface GeneratePdfOptions {
  imageFileName?: string;
  videoUrl?: string;
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

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

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
  videoUrl,
  conversation,
  testQuestions,
  openQuestion,
}: GeneratePdfOptions): Promise<Uint8Array> {
  let imageBase64 = "";
  const escapedVideoUrl = videoUrl ? escapeHtml(videoUrl) : "";
  const activityType = imageFileName
    ? "Image"
    : videoUrl
      ? "Video"
      : "Conversation";

  if (imageFileName) {
    // Read image as base64
    const imagePath = path.join(TMP_IMAGE_DIR, imageFileName);
    console.log("[PDF] Using image path:", imagePath);
    try {
      const imageData = await fs.readFile(imagePath);
      imageBase64 = imageData.toString("base64");
    } catch (err) {
      console.error("[PDF] Failed to read image file:", err);
      // We can continue without image if another content source exists.
      if (!conversation && !videoUrl) throw err;
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
            margin-bottom: 60px;
          }
          h2, h3 {
            color: #4c84ff;
            margin-bottom: 0.5em;
            margin-bottom: 30px;
          }
          img {
            max-width: 100%;
            border-radius: 24px;
            margin-bottom: 32px;
            border: 2px solid #4c84ff;
            box-shadow: 0 4px 24px #4c84ff22;
          }
          .source-block {
            margin-bottom: 32px;
            padding: 20px 24px;
            border-radius: 20px;
            border: 1px solid #4c84ff33;
            background: #1a1a2b;
            box-shadow: 0 4px 24px #4c84ff11;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .source-label {
            color: #4c84ff;
            font-size: 0.95rem;
            font-weight: 700;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .source-link {
            color: #c4d8ff;
            text-decoration: underline;
            word-break: break-all;
            line-height: 1.6;
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
            margin-bottom: 200px;
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
          .test-questions {
            margin-bottom: 60px;
          }
        </style>
      </head>
      <body>
        <h1>${activityType} Activity</h1>
        ${imageBase64 ? `<img src="data:image/png;base64,${imageBase64}" alt="Lesson Image" />` : ""}
        ${
          escapedVideoUrl
            ? `
          <div class="source-block">
            <div class="source-label">Source Video</div>
            <a class="source-link" href="${escapedVideoUrl}">${escapedVideoUrl}</a>
          </div>
        `
            : ""
        }

        ${
          conversation && conversation.length > 0
            ? `
          <div class="conversation-container">
            <h2>Conversation</h2>
            ${conversation
              .map(
                (msg, i) => `
              <div class="message ${i % 2 === 0 ? "speaker-a" : "speaker-b"}">
                <div class="speaker-name">${escapeHtml(msg.speaker)}</div>
                <div class="text">${escapeHtml(msg.text)}</div>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }
        <div class="test-questions">
          <h2>${imageFileName ? "Fill in the gaps" : "Test Questions"}</h2>
          ${testQuestions
            .map(
              (q, i) => `
                <div class="question">
                  <div><b>${i + 1}.</b> ${escapeHtml(q.question)}</div>
                  <div class="options">
                    ${q.options
                      .map(
                        (opt, idx) =>
                          `<div class="option${idx === q.correctAnswer ? " correct" : ""}">${String.fromCharCode(97 + idx)}) ${escapeHtml(opt)}</div>`,
                      )
                      .join("")}
                  </div>
                </div>
              `,
            )
            .join("")}
        </div>
        <div class="open-question">
          <h3>Open Question</h3>
          <div>${escapeHtml(openQuestion)}</div>
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
