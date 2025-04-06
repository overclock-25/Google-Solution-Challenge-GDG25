'use client'

import React, { useState, useRef } from 'react';
import { BsStars } from 'react-icons/bs';
import Image from 'next/image';

const base_url = process.env.NEXT_PUBLIC_BASE_URL;
const api_key = process.env.MY_API_KEY;
const auth_key = process.env.AUTH_KEY;

export default function PlantDiseaseDetector() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const handleFileReplace = () => {
    fileInputRef.current.click();
  };
  

  const processFile = (selectedFile) => {
    if (selectedFile) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Please upload a valid image file (JPEG, PNG, or GIF)");
        return;
      }

      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    processFile(droppedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log(formData);

      const response = await fetch("/api/check", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${auth_key}`
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      console.log(response.status);

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-br from-green-50 to-green-100">
      <h1 className="text-4xl font-extrabold mb-8 text-green-900 text-center">
        Plant Health Guardian
      </h1>

      <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-2xl">
        {/* Drag and Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`mb-6 p-8 border-2 border-dashed rounded-xl text-center transition-all duration-300 
            ${previewUrl
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300 hover:border-green-400 bg-gray-50 hover:bg-green-50'}`}
        >
          {!previewUrl ? (
            <>
              <p className="text-gray-600 mb-4">
                Drag and drop an image here, or
                <label htmlFor="file-upload" className="ml-2 text-green-600 cursor-pointer hover:underline">
                  click to select
                </label>
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: JPEG, PNG, GIF (Max 5MB)
              </p>
            </>
          ) : (
            <div className="relative">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleRemoveFile}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Remove Image
                </button>
                <button
                  onClick={handleFileReplace}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  Replace Image
                </button>
              </div>
              <div className="relative h-64 w-full mt-4">
                <Image
                  src={previewUrl}
                  alt="Uploaded plant image"
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

          <input
            type="file"
            id="file-upload"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Submit Button */}
        {file && (
          <div className="flex items-center justify-center text-center mb-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex items-center justify-center mx-auto px-6 py-3 rounded-full text-white font-semibold transition duration-300 ${loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
                }`}
            >
              <BsStars className="mr-2 text-2xl" />
              {loading ? "Analyzing Plant Health..." : "Detect Plant Issues"}
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold text-center mb-4">Analysis Results</h2>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Original Image */}
              {previewUrl && (
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-center">Original Image</h3>
                  <div className="relative h-64 w-full">
                    <Image
                      src={previewUrl}
                      alt="Original plant image"
                      fill
                      style={{ objectFit: 'contain' }}
                      className="rounded-xl shadow-md"
                    />
                  </div>
                </div>
              )}

              {/* Processed Image */}
              {result.processed_image && (
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 text-center">Analyzed Image</h3>
                  <div className="relative h-64 w-full">
                    <Image
                      src={result.processed_image}
                      alt="Processed plant image"
                      fill
                      style={{ objectFit: 'contain' }}
                      className="rounded-xl shadow-md"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Analysis */}
            <div className="mt-6">
              {!result.detected ? (
                <div className="p-6 bg-green-100 border-l-4 border-green-500 text-green-800 rounded-xl text-center">
                  <h3 className="text-xl font-bold mb-2">Great News!</h3>
                  <p>Your plant appears to be healthy and shows no signs of disease or pest infestation.</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold mb-4 text-center text-yellow-700">Plant Health Concerns Detected</h3>
                  <div className="space-y-4">
                    {result.issues.map((issue, index) => (
                      <div
                        key={index}
                        className="p-5 bg-yellow-50 border-l-4 border-yellow-400 rounded-xl hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-bold text-yellow-800">{issue.name}</h4>
                          <span className="text-sm bg-yellow-200 px-2 py-1 rounded">
                            {issue.type}
                          </span>
                        </div>
                        <div className="text-gray-700">
                          <p className="mb-2">
                            <span className="font-semibold">Confidence:</span> {issue.confidence}%
                          </p>
                          <p className="mb-2">
                            <span className="font-semibold">Description:</span> {issue.description}
                          </p>
                          <p>
                            <span className="font-semibold">Recommended Treatment:</span> {issue.treatment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}