import React from "react";

interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
}

interface TestQuestionsProps {
  questions?: Question[];
  className?: string;
}

/**
 * TestQuestions component for displaying multiple-choice questions.
 * Designed based on the premium dark-themed mockup.
 */
const TestQuestions: React.FC<TestQuestionsProps> = ({
  questions = [],
  className = "",
}) => {
  if (!questions || questions.length === 0) return null;

  return (
    <section className={`flex flex-col gap-6 ${className}`}>
      <h2 className="text-2xl font-semibold text-[#b388ff]">
        Comprehension Questions
      </h2>

      <div className="flex flex-col gap-8">
        {questions.map((q) => (
          <div key={q.id} className="flex flex-col gap-4">
            <h3 className="text-lg font-medium text-gray-100 flex gap-2">
              <span className="text-gray-400">{q.id}.</span>
              {q.question}
            </h3>

            <div className="flex flex-col gap-3">
              {q.options.map((option) => (
                <div
                  key={option.id}
                  className={`relative flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 ${
                    option.isCorrect
                      ? "bg-green-500/10 border-green-500/50 text-white shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                      : "bg-[#1a1a1a] border-white/5 text-gray-300 hover:border-white/10"
                  }`}
                >
                  <div className="flex gap-2 items-center">
                    <span className="text-gray-500 font-mono w-4">
                      {option.id})
                    </span>
                    <span>{option.text}</span>
                  </div>

                  {option.isCorrect && (
                    <div className="text-green-500 animate-in fade-in zoom-in duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestQuestions;
