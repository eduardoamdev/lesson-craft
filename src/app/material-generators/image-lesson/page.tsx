"use client";

import Link from "next/link";

export default function ImageLessonGenerator() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#121212] rounded-[2rem] p-10 shadow-2xl border border-white/5 mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-[#fbbf24] p-1 rounded-sm w-12 h-12 flex items-center justify-center shadow-lg">
              <span className="text-2xl">🖼️</span>
            </div>
            <h1 className="text-4xl font-bold tracking-wide text-[#5daaf0]">
              Image Activity Craft
            </h1>
          </div>
          <p className="text-[#94a3b8] text-lg">
            Select an image to generate lesson activities
          </p>
        </div>

        {/* Action Content Area */}
        <div className="space-y-8">
          {/* Upload Area */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#1e3a8a]/80 bg-[#121212] rounded-3xl p-16 hover:border-[#3b82f6] transition-all cursor-pointer group">
            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-7xl">📂</span>
            </div>
            <p className="text-white font-bold text-2xl">
              Click to upload an image
            </p>
            <p className="text-[#64748b] text-base mt-1">
              Supports JPG, PNG, GIF
            </p>
          </div>

          {/* Image Description Section */}
          <div className="space-y-3">
            <label className="text-[#e2e8f0] font-semibold block text-base pl-1">
              Image Description
            </label>
            <textarea
              className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl p-6 text-[#cbd5e1] min-h-[160px] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]/50 resize-none transition-all placeholder:text-[#475569]"
              placeholder="Describe the image in detail. This description will be used to generate the lesson activity..."
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-4 pt-2">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl border border-[#1e3a8a]/50 text-[#60a5fa] hover:bg-[#1e3a8a]/10 transition-all font-semibold"
            >
              <span className="text-lg font-bold">←</span>
              Back
            </Link>
            <button className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-[#1e3a8a] to-[#581c87] text-white font-bold hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-blue-950/40">
              Generate Activity
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
