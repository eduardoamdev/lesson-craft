"use client";

import { useImageUpload } from "@/hooks/useImageUpload";
import Button from "@/components/ui/Button";
import UploadZone from "@/components/image-lesson/UploadZone";
import TextArea from "@/components/ui/TextArea";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function ImageLessonGenerator() {
  const {
    selectedFile,
    previewUrl,
    description,
    setDescription,
    age,
    setAge,
    level,
    setLevel,
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

  const levelOptions = [
    { value: "A1", label: "A1 (Beginner)" },
    { value: "A2", label: "A2 (Elementary)" },
    { value: "B1", label: "B1 (Intermediate)" },
    { value: "B2", label: "B2 (Upper Intermediate)" },
    { value: "C1", label: "C1 (Advanced)" },
    { value: "C2", label: "C2 (Proficient)" },
  ];

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

          {/* Upload Area Component */}
          <UploadZone
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            isDragging={isDragging}
            onUploadClick={handleUploadClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          />

          {/* Image Description Component */}
          <TextArea
            label="Image Description"
            placeholder="Describe the image in detail. This description will be used to generate the lesson activity..."
            value={description}
            onChange={setDescription}
          />

          {/* Age and Level Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Student's Age"
              placeholder="e.g. 12, 25, Adults..."
              value={age}
              onChange={setAge}
            />
            <Select
              label="English Level"
              value={level}
              onChange={setLevel}
              options={levelOptions}
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
