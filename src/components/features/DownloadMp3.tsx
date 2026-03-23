import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { LessonData } from "@/types/lesson";
import { generateAudio } from "@/api-clients/conversation-lesson/audio";

interface DownloadMp3Props {
  lessonData: LessonData | null;
}

/**
 * DownloadMp3 component for generating and downloading an MP3 audio file.
 * Handles audio generation via API client, manages download state, and triggers file download.
 * Used in conversation-lesson view to provide synthesized audio as a final output.
 */
const DownloadMp3 = ({ lessonData }: DownloadMp3Props) => {
  const downloadRef = useRef<HTMLAnchorElement | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!lessonData?.conversation) {
      alert("No conversation data found!");
      return;
    }

    setDownloading(true);

    try {
      const response = await generateAudio(lessonData.conversation);

      if (!response.ok) throw new Error("Failed to generate audio");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Trigger the hidden anchor link click after a small delay to ensure state update
      setTimeout(() => {
        if (downloadRef.current) {
          downloadRef.current.click();
        }
      }, 100);
    } catch (err) {
      alert("Failed to generate audio");
      console.error(err);
    } finally {
      setTimeout(() => setDownloading(false), 500);
    }
  };

  return (
    <Button
      variant="gradient"
      className="px-6 py-3 h-12 rounded-xl text-sm w-full lg:w-auto"
      disabled={downloading}
      onClick={handleDownload}
      icon={
        downloading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "🔊"
        )
      }
    >
      {downloading ? "Downloading audio..." : "Download Audio"}
      {audioUrl && (
        <a
          href={audioUrl}
          download="conversation-audio.mp3"
          ref={downloadRef}
          style={{ display: "none" }}
        >
          Download Audio
        </a>
      )}
    </Button>
  );
};

export default DownloadMp3;
