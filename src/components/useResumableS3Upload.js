import { useState, useRef } from "react";
import axios from "axios";

// Helper to save and load upload state from localStorage
const UPLOAD_STATE_KEY = "sandrop_upload_state";
function saveUploadState(state) {
  localStorage.setItem(UPLOAD_STATE_KEY, JSON.stringify(state));
}
function loadUploadState() {
  const s = localStorage.getItem(UPLOAD_STATE_KEY);
  return s ? JSON.parse(s) : null;
}
function clearUploadState() {
  localStorage.removeItem(UPLOAD_STATE_KEY);
}

export function useResumableS3Upload({ apiBaseUrl, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle, uploading, paused, error, complete
  const [error, setError] = useState(null);
  const [resumeInfo, setResumeInfo] = useState(loadUploadState());
  const abortRef = useRef(null);

  // Main upload function
  const upload = async (file) => {
    setStatus("uploading");
    setError(null);

    // 1. Initiate or resume
    let uploadId, key, uploadedParts = [];
    const partSize = 5 * 1024 * 1024;
    const numParts = Math.ceil(file.size / partSize);

    // Try to resume
    let state = loadUploadState();
    if (state && state.fileName === file.name && state.fileSize === file.size) {
      uploadId = state.uploadId;
      key = state.key;
      uploadedParts = state.uploadedParts || [];
    } else {
      // New upload
      const { data } = await axios.post(`${apiBaseUrl}/multipart/initiate`, {
        fileName: file.name,
        fileType: file.type,
      });
      uploadId = data.uploadId;
      key = data.key;
      uploadedParts = [];
      saveUploadState({ fileName: file.name, fileSize: file.size, uploadId, key, uploadedParts });
    }

    // 2. Upload parts
    let parts = [...uploadedParts];
    try {
      for (let partNumber = 1; partNumber <= numParts; partNumber++) {
        // Skip already uploaded parts
        if (parts.find(p => p.PartNumber === partNumber)) continue;

        const start = (partNumber - 1) * partSize;
        const end = Math.min(start + partSize, file.size);
        const blob = file.slice(start, end);

        // Get presigned URL for this part
        const { data: { url } } = await axios.post(`${apiBaseUrl}/multipart/part-url`, {
          key,
          uploadId,
          partNumber,
        });

        // Upload the part
        abortRef.current = new AbortController();
        const response = await axios.put(url, blob, {
          headers: { "Content-Type": file.type },
          signal: abortRef.current.signal,
          onUploadProgress: (e) => {
            const uploaded = (partNumber - 1) * partSize + e.loaded;
            setProgress(Math.min(100, Math.round((uploaded / file.size) * 100)));
          }
        });

        // Get ETag from response headers (try both lowercase and uppercase, and parse if needed)
        let ETag = response.headers.etag || response.headers.ETag;
        if (!ETag && response.headers["x-amz-etag"]) ETag = response.headers["x-amz-etag"];
        if (!ETag && response.data && response.data.ETag) ETag = response.data.ETag;
        if (!ETag) {
          throw new Error("Missing ETag in S3 response. Check your S3 CORS config to expose ETag header.");
        }
        parts.push({ ETag, PartNumber: partNumber });
        saveUploadState({ fileName: file.name, fileSize: file.size, uploadId, key, uploadedParts: parts });
      }

      // 3. Complete upload
      parts.sort((a, b) => a.PartNumber - b.PartNumber);
      await axios.post(`${apiBaseUrl}/multipart/complete`, {
        key,
        uploadId,
        parts,
      });

      setProgress(100);
      setStatus("complete");
      clearUploadState();
      if (onComplete) onComplete({ key });
    } catch (err) {
      if (err.code === "ERR_CANCELED") {
        setStatus("paused");
      } else {
        setStatus("error");
        setError(err.message || "Upload failed");
      }
      setResumeInfo({ fileName: file.name, fileSize: file.size, uploadId, key, uploadedParts: parts });
    }
  };

  // Pause upload
  const pause = () => {
    if (abortRef.current) abortRef.current.abort();
    setStatus("paused");
  };

  // Resume upload
  const resume = async (file) => {
    setStatus("uploading");
    setError(null);
    await upload(file);
  };

  // Retry upload
  const retry = async (file) => {
    setStatus("uploading");
    setError(null);
    await upload(file);
  };

  // Clear state
  const clear = () => {
    clearUploadState();
    setProgress(0);
    setStatus("idle");
    setError(null);
    setResumeInfo(null);
  };

  return { progress, status, error, upload, pause, resume, retry, clear, resumeInfo };
} 