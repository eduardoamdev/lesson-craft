"use client";

import { use, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import ActionBar from "@/components/ui/ActionBar";
import TestQuestions from "@/components/features/TestQuestions";
import OpenQuestion from "@/components/features/OpenQuestion";
import Title from "@/components/ui/Title";
import DownloadPdf from "@/components/features/DownloadPdf";
import VideoPreview from "@/components/features/VideoPreview";
import { useLessonData } from "@/utils/common/useLessonData";

export default function VideoLessonOverview({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const lessonData = useLessonData(resolvedSearchParams?.data);

  if (!isMounted) {
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
            Generated Video Activity
          </Title>
          <ActionBar>
            <DownloadPdf lessonData={lessonData} />
          </ActionBar>
        </div>

        <VideoPreview
          videoId={lessonData?.videoId}
          age={lessonData?.age}
          level={lessonData?.level}
        />

        {lessonData?.multipleChoiceSentences &&
          lessonData.multipleChoiceSentences.length > 0 && (
            <TestQuestions
              title="Comprehension Questions"
              questions={lessonData.multipleChoiceSentences}
              className="mt-4"
            />
          )}

        {lessonData?.openQuestion && (
          <OpenQuestion question={lessonData.openQuestion} />
        )}

        <ActionBar>
          <Button
            variant="blue"
            className="px-6 py-3 h-12 rounded-xl text-sm w-full lg:w-auto"
            href="/"
          >
            Home
          </Button>
          <Button
            variant="blue"
            className="px-6 py-3 h-12 rounded-xl text-sm w-full lg:w-auto"
            href="/material-generators/video-lesson/generator"
          >
            New video activity
          </Button>
          <Button
            variant="blue"
            className="px-6 py-3 h-12 rounded-xl text-sm w-full lg:w-auto"
            href={`/material-generators/video-lesson/update?data=${encodeURIComponent(resolvedSearchParams?.data ?? "")}`}
          >
            Edit activity
          </Button>
        </ActionBar>
      </div>
    </main>
  );
}
