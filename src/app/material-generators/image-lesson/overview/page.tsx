"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import ActionBar from "@/components/common/ActionBar";
import TestQuestions from "@/components/common/TestQuestions";
import OpenQuestion from "@/components/common/OpenQuestion";
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setIsMounted(true);
  }, []);

  let lessonData: LessonData | null = null;
  if (resolvedSearchParams?.data) {
    try {
      lessonData = JSON.parse(decodeURIComponent(resolvedSearchParams.data));
    } catch (error) {
      if (error) console.error("Failed to parse lesson data from URL:", error);
    }
  }

  const imageUrl = lessonData?.imageFileName
    ? `/api/image-lesson/image-file?filename=${lessonData.imageFileName}`
    : lessonData?.imageUrl;

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
          <h1 className="text-4xl font-bold tracking-tight text-[#4c84ff] text-center">
            Generated Image Activity
          </h1>

          <ActionBar>
            <Button
              variant="blue"
              className="px-6 py-3 h-12 rounded-xl text-sm w-full lg:w-auto"
            >
              Generate PDF
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
              <p>Image not found</p>
            </div>
          </div>
        )}

        {lessonData?.multiple_choice_sentences && (
          <TestQuestions
            title="Fill in the gaps"
            questions={lessonData.multiple_choice_sentences}
            className="mt-4"
          />
        )}

        {lessonData?.open_question && (
          <OpenQuestion question={lessonData.open_question} />
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
            href="/material-generators/image-lesson/generator"
          >
            New image activity
          </Button>
          <Button
            variant="blue"
            className="px-6 py-3 h-12 rounded-xl text-sm w-full lg:w-auto"
          >
            Edit activity
          </Button>
        </ActionBar>
      </div>
    </main>
  );
}
