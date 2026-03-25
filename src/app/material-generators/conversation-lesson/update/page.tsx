"use client";

import ActionBar from "@/components/ui/ActionBar";
import Title from "@/components/ui/Title";
import Button from "@/components/ui/Button";
import TestQuestionsEditor from "@/components/features/TestQuestionsEditor";
import OpenQuestionEditor from "@/components/features/OpenQuestionEditor";
import ConversationEditor from "@/components/features/ConversationEditor";
import { LessonData } from "@/types/lesson";
import { useLessonData } from "@/utils/useLessonData";
import { use, useState } from "react";

/**
 * Update component for editing a conversation lesson activity.
 * Resolves search parameters, displays the edit UI, and provides navigation and save actions.
 * Follows the pattern established in the image-lesson update page.
 */
export default function UpdateConversationLesson({
  searchParams,
}: {
  searchParams: Promise<{ data?: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  // Store original data (immutable) and draft data (editable)
  const [originalData, setOriginalData] = useState<LessonData | null>(null);
  const [draftData, setDraftData] = useState<LessonData | null>(null);

  const lessonData = useLessonData(resolvedSearchParams?.data);

  if (lessonData && !originalData) {
    setOriginalData(lessonData);
    setDraftData(JSON.parse(JSON.stringify(lessonData)));
  }

  // Always use the original data for Go Back (cancels current draft)
  const goBackHref = originalData
    ? `/material-generators/conversation-lesson/overview?data=${encodeURIComponent(JSON.stringify(originalData))}`
    : "/material-generators/conversation-lesson/overview";

  // Save handler: copy draftData to originalData
  const handleSave = () => {
    if (draftData) {
      setOriginalData(JSON.parse(JSON.stringify(draftData)));
      alert("Changes saved!");
    }
  };

  if (!draftData) {
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
            Edit Conversation Activity
          </Title>
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

        <div className="flex flex-col gap-12">
          {/* Conversation/Dialogue Section */}
          <ConversationEditor
            conversation={draftData.conversation || []}
            onChange={(conv) =>
              setDraftData((prev) => (prev ? { ...prev, conversation: conv } : null))
            }
          />

          {/* Test Questions Section */}
          <TestQuestionsEditor
            questions={draftData.multipleChoiceSentences || []}
            onChange={(qs) =>
              setDraftData((prev) =>
                prev ? { ...prev, multipleChoiceSentences: qs } : null
              )
            }
          />

          {/* Open Question Section */}
          <OpenQuestionEditor
            value={draftData.openQuestion || ""}
            onChange={(q) =>
              setDraftData((prev) => (prev ? { ...prev, openQuestion: q } : null))
            }
          />
        </div>
      </div>
    </main>
  );
}
