import puppeteer from "puppeteer";
import path from "path";
import fs from "fs/promises";

const CHROME_EXECUTABLE_PATH =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  process.env.CHROME_EXECUTABLE_PATH ||
  "/usr/bin/chromium-browser";

export interface GeneratePdfOptions {
  imageFileName: string;
  testQuestions: Array<{
    sentence: string;
    options: string[];
    correct_option: number;
  }>;
  openQuestion: string;
}

const TMP_IMAGE_DIR = path.join(process.cwd(), "tmp", "image-lesson");

export async function generatePdf({
  imageFileName,
  testQuestions,
  openQuestion,
}: GeneratePdfOptions): Promise<Uint8Array> {
  // Read image as base64
  const imagePath = path.join(TMP_IMAGE_DIR, imageFileName);
  console.log("[PDF] Using image path:", imagePath);
  let imageData;
  try {
    imageData = await fs.readFile(imagePath);
  } catch (err) {
    console.error("[PDF] Failed to read image file:", err);
    throw err;
  }
  const imageBase64 = imageData.toString("base64");

  // Build HTML
  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; }
          img { max-width: 100%; border-radius: 16px; margin-bottom: 24px; }
          .question {
            margin-bottom: 18px;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .options { margin-left: 24px; }
          .correct { color: green; font-weight: bold; }
          .open-question { margin-top: 32px; background: #f3f3f3; padding: 16px; border-radius: 8px; }
        </style>
      </head>
      <body>
        <img src="data:image/png;base64,${imageBase64}" alt="Lesson Image" />
        <h2>Test Questions</h2>
        ${testQuestions
          .map(
            (q, i) => `
              <div class="question">
                <div><b>${i + 1}.</b> ${q.sentence}</div>
                <div class="options">
                  ${q.options
                    .map(
                      (opt, idx) =>
                        `<div class="$${idx === q.correct_option ? "correct" : ""}">${String.fromCharCode(97 + idx)}) ${opt}</div>`,
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
