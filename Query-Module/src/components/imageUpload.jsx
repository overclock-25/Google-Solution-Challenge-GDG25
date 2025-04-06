"use client";

import { useState, useRef } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImageUpload = ({ onImageChange }) => {
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      onImageChange(file);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full space-y-4">
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />

      {preview ? (
        <div className="image-preview min-h-[150px]">
          <img src={preview} alt="Preview" />
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-2 right-2 opacity-80 hover:bg-emerald-400"
            onClick={triggerFileInput}
          >
            Change Image
          </Button>
        </div>
      ) : (
        <div
          className={`drop-zone min-h-[150px] ${isDragging ? "active" : ""}`}
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <p className="font-medium text-gray-700 mb-1">
            Drag and drop an image
          </p>
          <p className="text-sm text-gray-500">or click to browse</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
