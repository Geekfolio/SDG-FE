"use client";

import React, { useState } from "react";

export default function CertificateUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [hackathonName, setHackathonName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // Simulate an upload process
    setUploadStatus("Uploading...");
    setTimeout(() => {
      setUploadStatus("Upload successful!");
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <label htmlFor="hackathonName" className="block text-sm font-medium text-gray-700">
          Hackathon name
        </label>
        <input
          id="hackathonName"
          type="text"
          value={hackathonName}
          onChange={(e) => setHackathonName(e.target.value)}
          placeholder="Enter hackathon name"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2"
        />
      </div>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleUpload}
      >
        Upload Certificate
      </button>
      {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
    </div>
  );
}
