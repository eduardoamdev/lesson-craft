"use client";

import { use } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import ActionBar from "@/components/common/ActionBar";
import TestQuestions from "@/components/common/TestQuestions";
import { LessonData } from "@/types/lesson";

/**
 * Overview page for the Image Activity Generator.
 * Receives the generated lesson data via query parameters and displays it.
 * Matches the design from the provided mockup.
 *
 * @param {OverviewProps} props - The component props containing searchParams.
 * @returns {JSX.Element} The rendered overview page.
 */
export default function ImageLessonOverview({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);

  let lessonData: LessonData | null = null;
  if (resolvedSearchParams?.data) {
    try {
      lessonData = JSON.parse(decodeURIComponent(resolvedSearchParams.data));
      console.log("Lesson JSON received via props:", lessonData);
    } catch (error) {
      if (error) console.error("Failed to parse lesson data from URL:", error);
    }
  }

  // Fallback dummy questions for demonstration - in a real scenario, these would come from lessonData
  const dummyQuestions = [
    {
      id: 1,
      question: "In the image, a player in a ________ shirt is attacking.",
      options: [
        { id: "a", text: "white" },
        { id: "b", text: "green" },
        { id: "c", text: "red", isCorrect: true },
        { id: "d", text: "blue" },
      ],
    },
    {
      id: 2,
      question: "Most of the players are wearing ________ clothes.",
      options: [
        { id: "a", text: "black" },
        { id: "b", text: "white", isCorrect: true },
        { id: "c", text: "yellow" },
        { id: "d", text: "red" },
      ],
    },
    {
      id: 3,
      question: "We can see a ________ in the goal.",
      options: [
        { id: "a", text: "referee" },
        { id: "b", text: "spectator" },
        { id: "c", text: "goalkeeper", isCorrect: true },
        { id: "d", text: "coach" },
      ],
    },
  ];

  const imageUrl = lessonData?.imageFileName
    ? `/api/image-lesson/image-file?filename=${lessonData.imageFileName}`
    : lessonData?.imageUrl || lessonData?.image_url;

  return (
    <main className="flex-1 w-full p-8 flex flex-col max-w-5xl mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 items-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#4c84ff] text-center">
            Generated Image Activity
          </h1>

          <ActionBar>
            <Button
              variant="gradient"
              className="px-6 py-3 h-12 rounded-xl text-sm w-full lg:w-auto"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              }
            >
              Generate PDF
            </Button>

            <Button
              variant="outline"
              className="px-6 py-3 h-12 rounded-xl text-sm w-full lg:w-auto"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              }
            >
              Edit Activity
            </Button>

            <Button
              variant="teal"
              className="px-6 py-3 h-12 rounded-xl text-sm w-full lg:w-auto"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              }
            >
              Save to Library
            </Button>

            <Button
              variant="purple"
              className="px-6 py-3 h-12 rounded-xl text-sm w-full lg:w-auto"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              }
            >
              Share Activity
            </Button>
          </ActionBar>
        </div>

        {imageUrl ? (
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl bg-[#121212]">
              <Image
                src={imageUrl}
                alt="Lesson content"
                width={1200}
                height={800}
                className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-700 ease-out"
                priority
                unoptimized
              />
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video flex items-center justify-center bg-[#121212] rounded-[2rem] border border-white/5 border-dashed">
            <div className="text-gray-500 animate-pulse flex flex-col items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              <p>Image not found</p>
            </div>
          </div>
        )}

        <TestQuestions
          questions={lessonData?.questions || dummyQuestions}
          className="mt-4"
        />
      </div>
    </main>
  );
}
