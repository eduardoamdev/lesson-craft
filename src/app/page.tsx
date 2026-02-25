export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#1a1a1a] rounded-2xl p-8 shadow-2xl border border-white/5">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎓</span>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Lesson Craft
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            Choose an activity type to create engaging English lessons
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#581c87] text-white font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
            <span>🖼️</span>
            Image Activity Craft
          </button>

          <button className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#701a75] to-[#991b1b] text-white font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
            <span>💬</span>
            Conversation Activity Craft
          </button>

          <button className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#075985] to-[#0d9488] text-white font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg">
            <span>🎬</span>
            Video Activity Craft
          </button>
        </div>
      </div>
    </main>
  );
}
