"use client";

import { use, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import ActionBar from "@/components/ui/ActionBar";
import TestQuestions from "@/components/features/TestQuestions";
import OpenQuestion from "@/components/features/OpenQuestion";
import Title from "@/components/ui/Title";
import DownloadPdf from "@/components/features/DownloadPdf";
import DownloadMp3 from "@/components/features/DownloadMp3";
import ConversationDialogue from "@/components/features/ConversationDialogue";
import { useLessonData } from "@/utils/common/useLessonData";

/**
 * Overview page for the Conversation Activity Generator.
 * Receives the generated lesson data via query parameters and displays it.
 * Includes a "Generate Audio" button and a view of the generated conversation dialogue.
 *
 * @param {object} props - The component props containing searchParams.
 * @returns {JSX.Element} The rendered overview page.
 */
export default function ConversationLessonOverview({
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
            Generated Conversation Activity
          </Title>
          <ActionBar>
            <DownloadPdf lessonData={lessonData} />
            <DownloadMp3 lessonData={lessonData} />
          </ActionBar>
        </div>
        <ConversationDialogue conversation={lessonData?.conversation} />

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
            href="/material-generators/conversation-lesson/generator"
          >
            New conversation activity
          </Button>
          <Button
            variant="blue"
            className="px-6 py-3 h-12 rounded-xl text-sm w-full lg:w-auto"
            href={`/material-generators/conversation-lesson/update?data=${encodeURIComponent(resolvedSearchParams?.data ?? "")}`}
          >
            Edit activity
          </Button>
        </ActionBar>
      </div>
    </main>
  );
}
