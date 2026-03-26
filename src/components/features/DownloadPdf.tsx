import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { LessonData } from "@/types/lesson";
import { generatePdf } from "@/api-clients/common/file-generators/pdf";

interface DownloadPdfProps {
  lessonData: LessonData | null;
  imageFileName?: string;
}

/**
 * DownloadPdf component for generating and downloading a PDF lesson file.
 * Handles PDF generation via API, manages download state, and triggers file download for the user.
 * Used in lesson views to allow users to export lesson content as a PDF.
 */
const DownloadPdf = ({ lessonData, imageFileName }: DownloadPdfProps) => {
  const downloadRef = useRef<HTMLAnchorElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  return (
    <Button
      variant="blue"
      className="px-6 py-3 h-12 rounded-xl text-sm w-full lg:w-auto"
      disabled={downloading}
      onClick={async () => {
        if (!lessonData) return;

        setDownloading(true);

        const testQuestions = lessonData.multipleChoiceSentences || [];

        const openQuestion = lessonData.openQuestion || "";

        const conversation = lessonData.conversation || [];

        const videoUrl = lessonData.videoId
          ? `https://www.youtube.com/watch?v=${lessonData.videoId}`
          : undefined;

        try {
          const response = await generatePdf({
            imageFileName,
            videoUrl,
            conversation,
            testQuestions,
            openQuestion,
          });

          if (!response.ok) throw new Error("Failed to generate PDF");

          const blob = await response.blob();

          const url = URL.createObjectURL(blob);

          setPdfUrl(url);

          setTimeout(() => {
            if (downloadRef && downloadRef.current) {
              downloadRef.current.click();
            }
          }, 100);
        } catch (err) {
          alert("Failed to generate PDF");

          console.error(err);
        } finally {
          setTimeout(() => setDownloading(false), 500);
        }
      }}
    >
      {downloading ? "Downloading PDF..." : "Download PDF"}
      {pdfUrl && (
        <a
          href={pdfUrl}
          download="lesson.pdf"
          ref={downloadRef}
          style={{ display: "none" }}
        >
          Download PDF
        </a>
      )}
    </Button>
  );
};

export default DownloadPdf;
