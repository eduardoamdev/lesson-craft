import { FC } from "react";

interface OpenQuestionEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

// OpenQuestionEditor renders a styled textarea for editing an open question.
// It receives the current value and an onChange handler as props.
const OpenQuestionEditor: FC<OpenQuestionEditorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold text-[#b388ff]">Open Question</h2>
      <textarea
        className="w-full min-h-[80px] bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 py-4 text-[#cbd5e1] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]/50 transition-all resize-vertical"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write the open question here..."
      />
    </div>
  );
};

export default OpenQuestionEditor;
