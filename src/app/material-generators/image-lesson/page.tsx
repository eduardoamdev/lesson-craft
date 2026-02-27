"use client";

import { useImageUpload } from "@/hooks/useImageUpload";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function ImageLessonGenerator() {
  const {
    selectedFile,
    previewUrl,
    description,
    setDescription,
    isUploading,
    isDragging,
    fileInputRef,
    handleUploadClick,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleGenerate,
  } = useImageUpload();

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
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Upload Area */}
          <div
            onClick={handleUploadClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-16 transition-all cursor-pointer group overflow-hidden relative min-h-[300px] ${
              isDragging
                ? "border-[#3b82f6] bg-[#3b82f6]/10 scale-[1.02]"
                : selectedFile
                  ? "border-[#3b82f6]/50 bg-[#1c1c1c]/50"
                  : "border-[#1e3a8a]/80 bg-[#121212] hover:border-[#3b82f6]"
            }`}
          >
            {previewUrl ? (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-contain p-4 rounded-xl shadow-lg"
                  unoptimized // Required for blob URLs
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl z-10">
                  <p className="text-white font-bold text-xl">Change Image</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <span className="text-7xl">📂</span>
                </div>
                <p className="text-white font-bold text-2xl">
                  {selectedFile
                    ? selectedFile.name
                    : "Click to upload an image"}
                </p>
                <p className="text-[#64748b] text-base mt-1">
                  Supports JPG, PNG, GIF
                </p>
              </>
            )}
          </div>

          {/* Image Description Section */}
          <div className="space-y-3">
            <label className="text-[#e2e8f0] font-semibold block text-base pl-1">
              Image Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-white/5 rounded-2xl p-6 text-[#cbd5e1] min-h-[160px] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20 focus:border-[#3b82f6]/50 resize-none transition-all placeholder:text-[#475569]"
              placeholder="Describe the image in detail. This description will be used to generate the lesson activity..."
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-4 pt-2">
            <Button href="/" variant="outline" className="flex-1" icon="←">
              Back
            </Button>
            <Button
              variant="gradient"
              className="flex-1"
              onClick={handleGenerate}
              disabled={isUploading || !selectedFile}
              icon={isUploading ? "⏳" : undefined}
            >
              {isUploading ? "Generating..." : "Generate Activity"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
