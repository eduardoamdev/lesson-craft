"use client";

import { use } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";

interface LessonData {
  imageUrl?: string;
  image_url?: string;
  imageFileName?: string;
  topic?: string;
  grade?: string;
  language?: string;
}

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
      console.error("Failed to parse lesson data from URL:", error);
    }
  }

  // Construct the image URL using the provided imageFileName or falling back to standard URL fields.
  // The images are served through a dedicated API endpoint since they reside in 'tmp/'.
  const imageUrl = lessonData?.imageFileName
    ? `/api/image-lesson/image-file?filename=${lessonData.imageFileName}`
    : lessonData?.imageUrl || lessonData?.image_url;

  return (
    <main className="flex-1 w-full p-8 flex flex-col max-w-5xl mx-auto">
      <div className="flex flex-col gap-8">
        {/* Titles and Actions Row */}
        <div className="flex flex-col gap-6 items-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#4c84ff] text-center">
            Generated Image Activity
          </h1>

          <div className="flex justify-center">
            <Button
              variant="gradient"
              className="w-auto px-6 py-3 h-12 rounded-xl text-sm"
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
          </div>
        </div>

        {/* Main Image Section */}
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
      </div>
    </main>
  );
}
