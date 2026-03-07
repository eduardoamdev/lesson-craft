import Image from "next/image";
import { DragEvent } from "react";

interface UploadZoneProps {
  selectedFile: File | null;
  previewUrl: string | null;
  isDragging: boolean;
  onUploadClick: () => void;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent) => void;
}

/**
 * Component for the image upload area, supporting click-to-select and drag-and-drop.
 *
 * @param {UploadZoneProps} props - Component properties including handlers and upload state.
 * @returns {JSX.Element} The rendered upload zone with preview or placeholder.
 */
export default function UploadZone({
  selectedFile,
  previewUrl,
  isDragging,
  onUploadClick,
  onDragOver,
  onDragLeave,
  onDrop,
}: UploadZoneProps) {
  return (
    <div
      onClick={onUploadClick}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
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
            unoptimized
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
            {selectedFile ? selectedFile.name : "Click to upload an image"}
          </p>
          <p className="text-[#64748b] text-base mt-1">
            Supports JPG, PNG, GIF
          </p>
        </>
      )}
    </div>
  );
}
