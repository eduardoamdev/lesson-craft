import Button from "@/components/ui/Button";

/**
 * The landing page of the application.
 * Displays various activity generation options for users to choose from.
 *
 * @returns {JSX.Element} The rendered homepage with navigation buttons.
 */
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
          <Button
            href="/material-generators/image-lesson/generator"
            variant="blue"
            icon="🖼️"
          >
            Image Activity Craft
          </Button>

          <Button
            href="/material-generators/conversation-lesson/generator"
            variant="purple"
            icon="💬"
          >
            Conversation Activity Craft
          </Button>

          <Button variant="teal" icon="🎬">
            Video Activity Craft
          </Button>
        </div>
      </div>
    </main>
  );
}
