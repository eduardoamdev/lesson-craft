export interface TestQuestion {
  correct_option: number;
  sentence: string;
  options: Array<string>;
}

export interface TestQuestionsProps {
  questions?: TestQuestion[];
  className?: string;
  title?: string;
}

/**
 * TestQuestions component for displaying multiple-choice questions.
 * Designed based on the premium dark-themed mockup.
 */
const TestQuestions = ({
  questions = [],
  className = "",
  title = "Comprehension Questions",
}: TestQuestionsProps) => {
  if (!questions || questions.length === 0) return null;

  return (
    <section className={`flex flex-col gap-6 ${className}`}>
      <h2 className="text-2xl font-semibold text-[#b388ff]">{title}</h2>
      <div className="flex flex-col gap-8">
        {questions.map((q, index) => (
          <div key={index} className="flex flex-col gap-4">
            <h3 className="text-lg font-medium text-gray-100 flex gap-2">
              <span className="text-gray-400">{index + 1}.</span>
              {q.sentence}
            </h3>

            <div className="flex flex-col gap-3">
              {q.options.map((optionText, optIndex) => {
                const isCorrect = q.correct_option === optIndex;
                const letter = String.fromCharCode(97 + optIndex); // a, b, c, d

                return (
                  <div
                    key={optIndex}
                    className={`relative flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 ${
                      isCorrect
                        ? "bg-green-500/10 border-green-500/50 text-white shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                        : "bg-[#1a1a1a] border-white/5 text-gray-300 hover:border-white/10"
                    }`}
                  >
                    <div className="flex gap-2 items-center">
                      <span className="text-gray-500 font-mono w-4">
                        {letter})
                      </span>
                      <span>{optionText}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestQuestions;
