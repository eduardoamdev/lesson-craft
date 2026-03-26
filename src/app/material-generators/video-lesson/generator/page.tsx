"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ActionBar from "@/components/ui/ActionBar";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Title from "@/components/ui/Title";
import Select from "@/components/ui/Select";
import { levelOptions } from "@/constants/levelOptions";
import { generateVideoLesson } from "@/api-clients/video-lesson/generate";

/**
 * Page component for the Video Activity Generator.
 * Provides a user interface for specifying a YouTube URL and metadata to generate activities.
 *
 * @returns {JSX.Element} The rendered generation tool page.
 */
export default function VideoLessonGenerator() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [age, setAge] = useState("");
  const [level, setLevel] = useState("A1");
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!youtubeUrl.trim()) {
      alert("Please provide a YouTube URL first");
      return;
    }

    setIsGenerating(true);

    try {
      const formData = new FormData();

      formData.append("youtubeUrl", youtubeUrl);
      formData.append("age", age);
      formData.append("level", level);

      const response = await generateVideoLesson(formData);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Generation failed");
      }

      const query = encodeURIComponent(JSON.stringify(data.activityData));

      router.push(`/material-generators/video-lesson/overview?data=${query}`);
    } catch (error) {
      console.error("Process error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An error occurred during the process.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#1a1a1a] rounded-[2rem] p-10 shadow-2xl border border-white/5 mx-auto">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-4 mb-3 text-center justify-center">
            <span className="text-4xl leading-none">🎬</span>
            <Title>Video Activity Craft</Title>
          </div>
          <p className="text-[#94a3b8] text-lg max-w-[80%] mx-auto leading-relaxed">
            Paste a YouTube URL to generate an activity from its transcript
          </p>
        </div>

        {/* Example URL box */}
        <div className="bg-[#1c1c1c] border-l-4 border-blue-600 p-5 rounded-r-2xl mb-8 shadow-md">
          <p className="text-[#94a3b8] text-md font-mono whitespace-nowrap overflow-hidden text-ellipsis">
            Example URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
          </p>
        </div>

        <div className="space-y-10">
          <Input
            label="YouTube URL"
            placeholder="https://www.youtube.com/watch?v=..."
            value={youtubeUrl}
            onChange={setYoutubeUrl}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Student's Age"
              placeholder="e.g. 12, 25, Adults..."
              value={age}
              onChange={setAge}
            />
            <Select
              label="English Level"
              value={level}
              onChange={setLevel}
              options={levelOptions}
            />
          </div>

          <div className="pt-2">
            <ActionBar>
              <Button href="/" variant="outline" className="flex-1" icon="←">
                Back
              </Button>
              <Button
                variant="purple"
                className="flex-1"
                onClick={handleGenerate}
                disabled={isGenerating}
                icon={isGenerating ? "⏳" : undefined}
              >
                {isGenerating ? "Generating..." : "Generate Activity"}
              </Button>
            </ActionBar>
          </div>
        </div>
      </div>
    </main>
  );
}
