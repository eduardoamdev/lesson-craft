import { ConversationTurn } from "@/types/lesson";

interface ConversationDialogueProps {
  conversation?: ConversationTurn[];
}

/**
 * ConversationDialogue component for displaying a chat-like dialogue.
 * Designed for the Conversation Activity Generator.
 */
const ConversationDialogue = ({
  conversation = [],
}: ConversationDialogueProps) => {
  if (!conversation || conversation.length === 0) {
    return (
      <div className="w-full aspect-video flex items-center justify-center bg-[#121212] rounded-[2rem] border border-white/5 border-dashed">
        <div className="text-gray-500 animate-pulse flex flex-col items-center gap-3">
          <p>Conversation not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative p-8 overflow-hidden rounded-[2rem] border border-white/5 shadow-2xl bg-[#121212] flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold text-[#b388ff]">Dialogue</h2>
        </div>

        <div className="flex flex-col gap-6">
          {conversation.map((turn, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex flex-col ${isEven ? "items-start" : "items-end"}`}
              >
                <span className="text-xs text-gray-500 mb-1 mx-2 uppercase tracking-wide font-semibold">
                  {turn.speaker}
                </span>
                <div
                  className={`px-6 py-4 max-w-[85%] sm:max-w-[70%] border shadow-md ${
                    isEven
                      ? "bg-[#1a1a1a] border-white/5 rounded-2xl rounded-tl-sm"
                      : "bg-blue-900/20 border-blue-500/10 text-blue-50 rounded-2xl rounded-tr-sm"
                  }`}
                >
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {turn.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConversationDialogue;
