"use client";

import { use, useState } from "react";
import ActionBar from "@/components/ui/ActionBar";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";
import TestQuestionsEditor from "@/components/features/TestQuestionsEditor";
import OpenQuestionEditor from "@/components/features/OpenQuestionEditor";
import VideoPreview from "@/components/features/VideoPreview";
import { LessonData } from "@/types/lesson";
import { useLessonData } from "@/utils/common/useLessonData";

export default function UpdateVideoLesson({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const [originalData, setOriginalData] = useState<LessonData | null>(null);
  const [draftData, setDraftData] = useState<LessonData | null>(null);

  const lessonData = useLessonData(resolvedSearchParams?.data);

  if (lessonData && !originalData) {
    setOriginalData(lessonData);
    setDraftData(JSON.parse(JSON.stringify(lessonData)));
  }

  const goBackHref = originalData
    ? `/material-generators/video-lesson/overview?data=${encodeURIComponent(JSON.stringify(originalData))}`
    : "/material-generators/video-lesson/overview";

  const handleSave = () => {
    if (draftData) {
      setOriginalData(JSON.parse(JSON.stringify(draftData)));
      alert("Changes saved!");
    }
  };

  if (!draftData) {
    return (
      <main className="flex-1 w-full p-8 flex flex-col max-w-5xl mx-auto">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[#4c84ff] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full p-8 flex flex-col max-w-5xl mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 items-center">
          <Title className="tracking-tight text-[#4c84ff] text-center">
            Edit Video Activity
          </Title>
          <ActionBar>
            <Button
              variant="blue"
              className="px-6 py-3 h-12 rounded-xl text-sm w-full lg:w-auto"
              href={goBackHref}
            >
              Go Back
            </Button>
            <Button
              variant="blue"
              className="px-6 py-3 h-12 rounded-xl text-sm w-full lg:w-auto"
              onClick={handleSave}
            >
              Save
            </Button>
          </ActionBar>
        </div>

        <VideoPreview
          videoId={draftData.videoId}
          age={draftData.age}
          level={draftData.level}
        />

        <div className="flex flex-col gap-8">
          <TestQuestionsEditor
            questions={draftData.multipleChoiceSentences || []}
            onChange={(questions) => {
              setDraftData((prev) =>
                prev ? { ...prev, multipleChoiceSentences: questions } : null,
              );
            }}
          />
          <OpenQuestionEditor
            value={draftData.openQuestion || ""}
            onChange={(question) => {
              setDraftData((prev) =>
                prev ? { ...prev, openQuestion: question } : null,
              );
            }}
          />
        </div>
      </div>
    </main>
  );
}
