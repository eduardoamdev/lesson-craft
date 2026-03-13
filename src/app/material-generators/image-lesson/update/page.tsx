"use client";

import ActionBar from "@/components/ui/ActionBar";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";
import Image from "next/image";
import TestQuestionsEditor from "@/components/features/TestQuestionsEditor";
import OpenQuestionEditor from "@/components/features/OpenQuestionEditor";
import { LessonData } from "@/types/lesson";

/**
 * Update component for editing an image lesson activity.
 * Resolves search parameters, displays the edit UI, and provides navigation and save actions.
 * Used in the material-generators/image-lesson/update route.
 */
export default function UpdateLessonContent({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  // Store original data (immutable) and draft data (editable)
  const [originalData, setOriginalData] = useState<LessonData | null>(null);
  const [draftData, setDraftData] = useState<LessonData | null>(null);

  useEffect(() => {
    searchParams.then((params) => {
      if (params?.data) {
        try {
          const parsed = JSON.parse(decodeURIComponent(params.data));
          setOriginalData(parsed);
          setDraftData(JSON.parse(JSON.stringify(parsed)));
        } catch (error) {
          console.error("Failed to parse search params data:", error);
          alert("Failed to load activity data. Please try again.");
        }
      }
    });
  }, [searchParams]);

  // Always use the original data for Go Back
  const goBackHref = originalData
    ? `/material-generators/image-lesson/overview?data=${encodeURIComponent(JSON.stringify(originalData))}`
    : "/material-generators/image-lesson/overview";

  // Save handler: copy draftData to originalData
  const handleSave = () => {
    setOriginalData(JSON.parse(JSON.stringify(draftData)));
    alert("Changes saved!");
  };

  return (
    <main className="flex-1 w-full p-8 flex flex-col max-w-5xl mx-auto">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-6 items-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#4c84ff] text-center">
            Edit Image Activity
          </h1>
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
        {draftData?.imageFileName && (
          <div className="relative group mb-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl bg-[#121212]">
              <Image
                src={`/api/image-lesson/image-file?filename=${draftData.imageFileName}`}
                alt={draftData.imageFileName || "Lesson image"}
                width={1200}
                height={800}
                className="w-full h-auto object-cover transform hover:scale-[1.01] transition-transform duration-700 ease-out"
                priority
                unoptimized
              />
            </div>
            <span className="text-gray-400 text-sm flex justify-center mt-2">
              {draftData.imageFileName}
            </span>
          </div>
        )}
        <div className="flex flex-col gap-8">
          <TestQuestionsEditor
            questions={draftData?.multiple_choice_sentences || []}
            onChange={(qs) => {
              setDraftData((prev) =>
                prev ? { ...prev, multiple_choice_sentences: qs } : null,
              );
            }}
          />
          <OpenQuestionEditor
            value={draftData?.open_question || ""}
            onChange={(q) => {
              setDraftData((prev) =>
                prev ? { ...prev, open_question: q } : null,
              );
            }}
          />
        </div>
      </div>
    </main>
  );
}
