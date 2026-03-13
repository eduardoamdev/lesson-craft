import React from "react";

interface OpenQuestionProps {
  question: string;
  className?: string;
}

/**
 * OpenQuestion component for displaying an open-ended question in a lesson.
 * Renders the question with styled UI and optional custom className.
 * Used to present open questions to students in lesson activities.
 */
const OpenQuestion: React.FC<OpenQuestionProps> = ({
  question,
  className = "",
}) => {
  if (!question) return null;
  return (
    <section className={`mt-8 flex flex-col gap-4 ${className}`}>
      <h2 className="text-2xl font-semibold text-[#4c84ff]">Open Question</h2>
      <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 text-lg text-gray-200">
        {question}
      </div>
    </section>
  );
};

export default OpenQuestion;
