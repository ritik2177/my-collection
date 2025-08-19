"use client";

import { useState } from "react";
import Image from "next/image";

export default function UploadImagePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadedUrl("");
      setErrorMsg("");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    try {
      const res = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setUploadedUrl(data.image.imageUrl);
        setErrorMsg("");
      } else {
        setErrorMsg(data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg("Something went wrong during upload.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Upload a Single Image</h1>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full border p-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}

      {uploadedUrl && (
        <div className="mt-4">
          <p className="font-medium">Uploaded Image:</p>
          <Image
            src={uploadedUrl}
            alt="Uploaded"
            width={240}
            height={240}
            className="w-60 border mt-2 rounded"
          />
          <p className="text-sm text-gray-600 mt-1">{uploadedUrl}</p>
        </div>
      )}
    </div>
  );
}
