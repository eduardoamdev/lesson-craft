import { ConversationTurn } from "@/types/lesson";
import { FC, useEffect, useRef } from "react";

interface ConversationEditorProps {
  conversation: ConversationTurn[];
  onChange: (conversation: ConversationTurn[]) => void;
}

/**
 * ConversationEditor component for editing conversation dialogue turns.
 * Includes speaker and text fields for each turn.
 */
const ConversationEditor: FC<ConversationEditorProps> = ({
  conversation,
  onChange,
}) => {
  const handleTurnChange = (
    index: number,
    field: keyof ConversationTurn,
    value: string,
  ) => {
    const updated = conversation.map((turn, i) =>
      i === index ? { ...turn, [field]: value } : turn,
    );
    onChange(updated);
  };

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold text-[#b388ff]">Dialogue</h2>
      <div className="flex flex-col gap-6">
        {conversation.map((turn, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={index}
              className={`flex flex-col ${isEven ? "items-start" : "items-end"} gap-2`}
            >
              <input
                className={`text-xs text-gray-500 mb-1 mx-2 uppercase tracking-wide font-semibold bg-transparent border-none focus:ring-2 focus:ring-[#4c84ff]/30 focus:outline-none px-2 py-1 rounded-md transition-all ${isEven ? "text-left" : "text-right"}`}
                value={turn.speaker}
                onChange={(e) =>
                  handleTurnChange(index, "speaker", e.target.value)
                }
                placeholder="Speaker"
              />
              <div
                className={`px-6 py-4 w-full max-w-[85%] sm:max-w-[70%] border shadow-md transition-all duration-300 ${
                  isEven
                    ? "bg-[#1a1a1a] border-white/5 rounded-2xl rounded-tl-sm focus-within:border-white/20"
                    : "bg-blue-900/20 border-blue-500/10 text-blue-50 rounded-2xl rounded-tr-sm focus-within:border-blue-500/30"
                }`}
              >
                <AutoResizeTextarea
                  className="text-base leading-relaxed whitespace-pre-wrap bg-transparent w-full outline-none resize-none overflow-hidden"
                  value={turn.text}
                  onChange={(value) => handleTurnChange(index, "text", value)}
                  placeholder="Dialogue text..."
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

interface AutoResizeTextareaProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

const AutoResizeTextarea: FC<AutoResizeTextareaProps> = ({
  value,
  onChange,
  className,
  placeholder,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resize();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onInput={resize}
      rows={1}
      placeholder={placeholder}
    />
  );
};

export default ConversationEditor;
