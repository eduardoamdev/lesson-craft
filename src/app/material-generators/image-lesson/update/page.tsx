"use client";

import ActionBar from "@/components/ui/ActionBar";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";

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
  const [resolvedSearchParams, setResolvedSearchParams] = useState<{
    data?: string;
  } | null>(null);

  useEffect(() => {
    searchParams.then(setResolvedSearchParams);
  }, [searchParams]);

  const goBackHref =
    resolvedSearchParams && resolvedSearchParams.data
      ? `/material-generators/image-lesson/overview?data=${encodeURIComponent(resolvedSearchParams.data)}`
      : "/material-generators/image-lesson/overview";

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
            >
              Save
            </Button>
          </ActionBar>
        </div>
      </div>
    </main>
  );
}
