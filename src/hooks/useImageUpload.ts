import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { useRouter } from "next/navigation";

/**
 * Custom hook to manage the state and logic for image-based lesson creation.
 * Provides handlers for file interaction, drag-and-drop, and the generation process.
 *
 * @returns {object} An object containing state variables and handler functions.
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
  const router = useRouter();

  /**
   * Triggers the hidden file input click event.
   *
   * @returns {void}
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handles the selection of a file via the input element.
   * Generates a preview URL for the selected image.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - The change event from the file input.
   * @returns {void}
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  /**
   * Updates state when a file is dragged over the upload zone.
   *
   * @param {DragEvent} e - The drag event.
   * @returns {void}
   */
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * Resets dragging state when a file leaves the upload zone.
   *
   * @returns {void}
   */
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  /**
   * Handles the file drop event, selecting the file if it is an image.
   *
   * @param {DragEvent} e - The drop event.
   * @returns {void}
   */
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

  /**
   * Orchestrates the full creation process: uploading the file and then
   * triggering the generation of the AI lesson content.
   *
   * @returns {Promise<void>}
   */
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
        router.push("/material-generators/image-lesson/overview");
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
