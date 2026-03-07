/**
 * Overview page for the Image Activity Generator.
 * Displays the generated lesson content.
 *
 * @returns {JSX.Element} The rendered overview page.
 */
export default function ImageLessonOverview() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#121212] rounded-[2rem] p-10 shadow-2xl border border-white/5 mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-wide text-[#5daaf0] mb-4">
          Overview
        </h1>
        <p className="text-gray-400">
          Your lesson activity has been generated.
        </p>
      </div>
    </main>
  );
}
