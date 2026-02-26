import Link from "next/link";

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
          <Link
            href="/material-generators/image-lesson"
            className="btn-base btn-blue"
          >
            <span>🖼️</span>
            Image Activity Craft
          </Link>

          <button className="btn-base btn-purple">
            <span>💬</span>
            Conversation Activity Craft
          </button>

          <button className="btn-base btn-teal">
            <span>🎬</span>
            Video Activity Craft
          </button>
        </div>
      </div>
    </main>
  );
}
