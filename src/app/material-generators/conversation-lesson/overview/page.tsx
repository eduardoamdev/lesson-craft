"use client";

import { use, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import ActionBar from "@/components/ui/ActionBar";
import TestQuestions from "@/components/features/TestQuestions";
import OpenQuestion from "@/components/features/OpenQuestion";
import Title from "@/components/ui/Title";
import { TestQuestion } from "@/types/lesson";
import DownloadPdf from "@/components/features/DownloadPdf";
import ConversationDialogue from "@/components/features/ConversationDialogue";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lessonData, setLessonData] = useState<any>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    if (resolvedSearchParams?.data) {
      try {
        setLessonData(
          JSON.parse(decodeURIComponent(resolvedSearchParams.data)),
        );
      } catch (error) {
        console.error("Failed to parse lesson data from URL:", error);
      }
    }
  }, [resolvedSearchParams?.data]);

  if (!isMounted) {
    return (
      <main className="flex-1 w-full p-8 flex flex-col max-w-5xl mx-auto">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-[#4c84ff] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  // Map the conversation lesson questions to the TestQuestions component expected format
  const formattedQuestions =
    lessonData?.multipleChoiceSentences?.map((q: TestQuestion) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
    })) || [];

  return (
    <main className="flex-1 w-full p-8 flex flex-col max-w-5xl mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 items-center">
          <Title className="tracking-tight text-[#4c84ff] text-center">
            Generated Conversation Activity
          </Title>
          <ActionBar>
            <DownloadPdf lessonData={lessonData} />
            <Button
              variant="gradient"
              className="px-6 py-3 h-12 rounded-xl text-sm w-full lg:w-auto"
              onClick={() => alert("Generate Audio functionality coming soon!")}
              icon="🔊"
            >
              Generate Audio
            </Button>
          </ActionBar>
        </div>
        <ConversationDialogue conversation={lessonData?.conversation} />

        {formattedQuestions.length > 0 && (
          <TestQuestions
            title="Comprehension Questions"
            questions={formattedQuestions}
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
