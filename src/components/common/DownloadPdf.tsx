import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { LessonData } from "@/types/lesson";

interface DownloadPdfProps {
  lessonData: LessonData | null;
  imageFileName: string | undefined;
}

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
        const testQuestions = lessonData.multiple_choice_sentences || [];
        const openQuestion = lessonData.open_question || "";
        try {
          const res = await fetch("/api/file-generators/pdf", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageFileName,
              testQuestions,
              openQuestion,
            }),
          });
          if (!res.ok) throw new Error("Failed to generate PDF");
          const blob = await res.blob();
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
