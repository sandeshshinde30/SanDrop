import React, { useRef, useState } from "react";
import { useResumableS3Upload } from "./useResumableS3Upload"; // path to the hook below

const API_BASE_URL = "http://localhost:5000"; // Change to your backend

export default function ResumableUploadComponent() {
  const fileInputRef = useRef();
  const [file, setFile] = useState(null);
  const {
    progress, status, error, upload, pause, resume, retry, clear, resumeInfo
  } = useResumableS3Upload({
    apiBaseUrl: API_BASE_URL,
    onComplete: ({ key }) => alert(`Upload complete! S3 key: ${key}`)
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    clear();
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="mb-4"
      />
      {file && (
        <div>
          <div className="mb-2">File: {file.name} ({(file.size/1024).toFixed(2)} KB)</div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mb-2">Progress: {progress}%</div>
          <div className="mb-2">Status: {status}</div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          {status === "idle" && (
            <button className="btn" onClick={() => upload(file)}>Start Upload</button>
          )}
          {status === "uploading" && (
            <button className="btn" onClick={pause}>Pause</button>
          )}
          {status === "paused" && (
            <button className="btn" onClick={() => resume(file)}>Resume</button>
          )}
          {status === "error" && (
            <button className="btn" onClick={() => retry(file)}>Retry</button>
          )}
          {(status === "complete" || status === "idle") && (
            <button className="btn" onClick={clear}>Clear</button>
          )}
        </div>
      )}
      {/* Show resume option if upload state exists */}
      {!file && resumeInfo && (
        <div className="mt-4">
          <div>Found incomplete upload: {resumeInfo.fileName}</div>
          <button className="btn" onClick={() => {
            fileInputRef.current.click();
          }}>Resume Upload</button>
        </div>
      )}
    </div>
  );
} 