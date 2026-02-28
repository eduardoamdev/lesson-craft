import { useState, useRef, ChangeEvent, DragEvent } from "react";

/**
 * Custom hook to handle image upload logic, including file selection,
 * drag-and-drop, preview generation, and API communication.
 */
export function useImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [age, setAge] = useState("");
  const [level, setLevel] = useState("A1");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      alert("Please select an image first");
      return;
    }

    setIsUploading(true);

    try {
      // Step 1: Upload
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("description", description);
      formData.append("age", age);
      formData.append("level", level);

      const uploadResponse = await fetch("/api/image-lesson/upload", {
        method: "POST",
        body: formData,
      });

      const uploadResult = await uploadResponse.json();
      console.log("Upload Result:", uploadResult);

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || "Upload failed");
      }

      const activityId = uploadResult.id;

      // Step 2: Generation
      const genResponse = await fetch("/api/image-lesson/generation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: activityId }),
      });

      const genResult = await genResponse.json();
      console.log("Generation Result:", genResult);

      if (genResult.success) {
        alert(`Activity generated successfully!\nID: ${genResult.id}`);
      } else {
        throw new Error(genResult.error || "Generation failed");
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

  return {
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
  };
}
