"use client";

import { use, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import ActionBar from "@/components/ui/ActionBar";
import TestQuestions from "@/components/features/TestQuestions";
import Title from "@/components/ui/Title";
import { TestQuestion } from "@/types/lesson";
import DownloadPdf from "@/components/features/DownloadPdf";

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
        {lessonData?.conversation && lessonData.conversation.length > 0 ? (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative p-8 overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl bg-[#121212] flex flex-col gap-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-semibold text-[#b388ff]">
                  Dialogue
                </h2>
              </div>

              <div className="flex flex-col gap-6">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {lessonData.conversation.map((turn: any, index: number) => {
                  const isEven = index % 2 === 0;
                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${isEven ? "items-start" : "items-end"}`}
                    >
                      <span className="text-xs text-gray-500 mb-1 mx-2 uppercase tracking-wide font-semibold">
                        {turn.speaker}
                      </span>
                      <div
                        className={`px-6 py-4 max-w-[85%] sm:max-w-[70%] border shadow-md ${
                          isEven
                            ? "bg-[#1a1a1a] border-white/5 rounded-2xl rounded-tl-sm"
                            : "bg-blue-900/20 border-blue-500/10 text-blue-50 rounded-2xl rounded-tr-sm"
                        }`}
                      >
                        <p className="text-base leading-relaxed whitespace-pre-wrap">
                          {turn.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video flex items-center justify-center bg-[#121212] rounded-[2rem] border border-white/5 border-dashed">
            <div className="text-gray-500 animate-pulse flex flex-col items-center gap-3">
              <p>Conversation not found</p>
            </div>
          </div>
        )}

        {formattedQuestions.length > 0 && (
          <TestQuestions
            title="Comprehension Questions"
            questions={formattedQuestions}
            className="mt-4"
          />
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
        </ActionBar>
      </div>
    </main>
  );
}
