"use client";

import { useEffect, use } from "react";

/**
 * Overview page for the Image Activity Generator.
 * Receives the generated lesson data via query parameters and logs it.
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

  useEffect(() => {
    if (resolvedSearchParams?.data) {
      try {
        const parsedData = JSON.parse(
          decodeURIComponent(resolvedSearchParams.data),
        );
        console.log("Lesson JSON received via props:", parsedData);
      } catch (error) {
        console.error("Failed to parse lesson data from URL:", error);
      }
    }
  }, [resolvedSearchParams]);

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#121212] rounded-[2rem] p-10 shadow-2xl border border-white/5 mx-auto text-center font-geist-sans uppercase tracking-[.1em]">
        <h1 className="text-4xl font-bold tracking-wide text-[#5daaf0] mb-4">
          Overview
        </h1>
        <p className="text-gray-400 text-sm">
          Activity loaded to browser console
        </p>
      </div>
    </main>
  );
}
