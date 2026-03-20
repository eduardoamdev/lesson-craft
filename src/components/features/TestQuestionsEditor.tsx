import { TestQuestion } from "@/types/testQuestions";
import { FC } from "react";

interface TestQuestionsEditorProps {
  questions: TestQuestion[];
  onChange: (questions: TestQuestion[]) => void;
}

const TestQuestionsEditor: FC<TestQuestionsEditorProps> = ({
  questions,
  onChange,
}) => {
  const handleQuestionChange = (
    questionIndex: number,
    field: keyof TestQuestion,
    value: string | number | null,
  ) => {
    const updated = questions.map((question, index) =>
      index === questionIndex ? { ...question, [field]: value } : question,
    );
    onChange(updated);
  };

  const handleOptionChange = (
    questionIndex: number,
    optIndex: number,
    value: string,
  ) => {
    const updated = questions.map((question, index) => {
      if (index !== questionIndex) return question;
      const newOptions = [...question.options];
      newOptions[optIndex] = value;
      return { ...question, options: newOptions };
    });
    onChange(updated);
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-8">
        <h2 className="text-2xl font-semibold text-[#b388ff]">
          Test questions
        </h2>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <span className="text-gray-400 text-lg font-mono">
                {questionIndex + 1}.
              </span>
              <input
                className="text-lg font-medium text-gray-100 flex-1 bg-transparent border-none focus:ring-2 focus:ring-[#4c84ff]/30 focus:outline-none px-0 py-2"
                value={question.sentence}
                onChange={(event) =>
                  handleQuestionChange(
                    questionIndex,
                    "sentence",
                    event.target.value,
                  )
                }
                placeholder="Question sentence"
              />
            </div>
            <div className="flex flex-col gap-3">
              {question.options.map((option, optionIndex) => {
                const isCorrect = question.correct_option === optionIndex;
                const letter = String.fromCharCode(97 + optionIndex);
                return (
                  <div
                    key={optionIndex}
                    className={`relative flex items-center justify-between px-5 py-4 rounded-xl border transition-all duration-200 ${
                      isCorrect
                        ? "bg-green-500/20 border-green-500 text-green-300 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                        : "bg-[#1a1a1a] border-white/5 text-gray-300 hover:border-white/10"
                    }`}
                  >
                    <div className="flex gap-2 items-center w-full">
                      <span className="text-gray-500 font-mono w-4 flex-shrink-0">
                        {letter})
                      </span>
                      <input
                        type="text"
                        className={`bg-transparent w-full outline-none truncate ${isCorrect ? "text-green-300" : "text-gray-300"}`}
                        value={option}
                        onChange={(event) =>
                          handleOptionChange(
                            questionIndex,
                            optionIndex,
                            event.target.value,
                          )
                        }
                        placeholder={`Option ${optionIndex + 1}`}
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="space-y-3 w-full mt-2">
              <label className="text-[#e2e8f0] font-semibold block text-base pl-1">
                Correct option:
              </label>
              <div className="relative">
                <select
                  className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl px-6 py-4 text-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]/50 transition-all appearance-none cursor-pointer"
                  value={
                    question.correct_option === null ||
                    question.correct_option === undefined
                      ? "none"
                      : question.correct_option
                  }
                  onChange={(event) => {
                    const value = event.target.value;
                    handleQuestionChange(
                      questionIndex,
                      "correct_option",
                      value === "none" ? null : Number(value),
                    );
                  }}
                >
                  <option value="none" className="bg-[#1c1c1c]">
                    None
                  </option>
                  {question.options.map((_, index) => (
                    <option
                      key={index}
                      value={index}
                      className="bg-[#1c1c1c]"
                    >{`Option ${index + 1}`}</option>
                  ))}
                </select>
                <div
                  className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#475569] text-xl"
                  style={{ WebkitTextStroke: "0.5px currentColor" }}
                >
                  ⌄
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestQuestionsEditor;
