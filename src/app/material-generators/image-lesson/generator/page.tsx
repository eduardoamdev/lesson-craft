"use client";

import { ChangeEvent, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import UploadZone from "@/components/ui/UploadZone";
import TextArea from "@/components/ui/TextArea";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { levelOptions } from "@/constants/levelOptions";
import { generateImageLesson } from "@/api-clients/image-lesson/generate";
import { useRouter } from "next/navigation";

/**
 * Page component for the Image Activity Generator.
 * Provides a user interface for uploading an image and specifying metadata to create AI-generated lessons.
 *
 * @returns {JSX.Element} The rendered generation tool page.
 */
export default function ImageLessonGenerator() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [level, setLevel] = useState("A1");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!selectedFile) {
      alert("Please select an image first");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);
      formData.append("description", description);
      formData.append("age", age);
      formData.append("level", level);

      const response = await generateImageLesson(formData);

      const parsedResponse = await response.json();

      if (parsedResponse.success) {
        const query = encodeURIComponent(
          JSON.stringify(parsedResponse.activityData),
        );

        router.push(`/material-generators/image-lesson/overview?data=${query}`);
      } else {
        alert("Failed to generate activity. Please try again.");
      }
    } catch (error) {
      console.error("Process error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "An error occurred during the process.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);

      const url = URL.createObjectURL(file);

      setPreviewUrl(url);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#121212] rounded-[2rem] p-10 shadow-2xl border border-white/5 mx-auto">
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
        <div className="space-y-8">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <UploadZone
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            onUploadClick={handleUploadClick}
          />
          <TextArea
            label="Image Description"
            placeholder="Describe the image in detail. This description will be used to generate the lesson activity..."
            value={description}
            onChange={setDescription}
          />
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
          <div className="flex flex-col gap-4 pt-2 md:flex-row">
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
