import React, { useState, useRef, useEffect } from "react";
import "../index.css";
import { Plus, Send, X } from "lucide-react";
import { FileText, Image, File, FileVideo, FileAudio, FileArchive, FileCode } from "lucide-react";
import config from "../url.js";
import axios from "axios";
import { useResumableS3Upload } from "./useResumableS3Upload";
import { v4 as uuidv4 } from "uuid";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const fileInputRef = useRef();
  const user = JSON.parse(localStorage.getItem("user"));

  const {
    progress, status, error, upload, pause, resume, retry, clear, resumeInfo
  } = useResumableS3Upload({
    apiBaseUrl: config.API_BASE_URL,
    onComplete: async ({ key }) => {
      // 1. Generate unique code (6 digits)
      const uniqueCode = Math.floor(100000 + Math.random() * 900000);
      // 2. Compose S3 URL
      const s3Url = `https://sandrop.s3.amazonaws.com/${key}`;
      // 3. Get user email
      const userEmail = user ? user.email : "guest@sandrop.com";
      // 4. Register in DB
      try {
        await axios.post(`${config.API_BASE_URL}/store-file`, {
          fileUrl: s3Url,
          uniqueCode,
          email: userEmail,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        });
        setShowSuccessPopup(true);
        setUploadedFile({ fileName: file.name, key, uniqueCode });
      } catch (err) {
        alert("Upload to S3 succeeded, but failed to register file in DB: " + (err.message || "Unknown error"));
      }
    }
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return <Image size={24} className="text-blue-500" />;
    if (fileType.startsWith("video/")) return <FileVideo size={24} className="text-red-500" />;
    if (fileType.startsWith("audio/")) return <FileAudio size={24} className="text-green-500" />;
    if (fileType === "application/pdf") return <FileText size={24} className="text-red-500" />;
    if (fileType.includes("word")) return <FileText size={24} className="text-blue-700" />;
    if (fileType.includes("zip") || fileType.includes("rar")) return <FileArchive size={24} className="text-yellow-600" />;
    if (fileType.includes("json") || fileType.includes("xml") || fileType.includes("javascript")) return <FileCode size={20} className="text-purple-500" />;
    return <File size={20} className="text-gray-500" />;
  };

  const formatFileSize = (size) => {
    return size < 1024
      ? `${size} B`
      : size < 1024 * 1024
      ? `${(size / 1024).toFixed(2)} KB`
      : `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    clear();
    setShowSuccessPopup(false);
    setUploadedFile(null);
  };

  const truncateFileName = (name, length = 15) => {
    return name.length > length ? name.substring(0, length) + "..." : name;
  };

  return (
    <form
      className="w-full flex flex-col gap-4"
      onSubmit={e => e.preventDefault()}
    >
      <h1 className="text-xl font-extrabold tracking-wide text-[#0077B6]">Send File</h1>
      <div className="flex items-center gap-3 border border-dashed border-gray-400 p-3 rounded-lg cursor-pointer">
        <label htmlFor="file" className="cursor-pointer flex items-center gap-2">
          <Plus className="text-blue-500" size={20} />
          <span className="text-gray-700 text-sm">Choose a file</span>
        </label>
        <input
          type="file"
          id="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple={false}
        />
      </div>
      {/* Progress/Status/Buttons Section */}
      {file && (
        <div className="w-full">
          <div className="flex flex-col gap-1 mb-3 bg-gray-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-gray-700 text-sm truncate max-w-[120px] overflow-hidden text-ellipsis whitespace-nowrap font-medium" title={file.name}>
                  {file.name}
                </span>
              </div>
              <span className="text-gray-400 text-xs font-medium">
                {formatFileSize(file.size)}
              </span>
              <button
                onClick={() => { setFile(null); clear(); setShowSuccessPopup(false); setUploadedFile(null); }}
                className="ml-2 p-1.5 rounded-full bg-gray-100 shadow-sm transition-colors duration-150 hover:bg-red-500 group focus:outline-none focus:ring-2 focus:ring-red-200"
                title="Remove file"
                type="button"
              >
                <X size={18} className="text-red-500 group-hover:text-white transition-colors duration-150" />
              </button>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div
                className="h-2 bg-[#90e0ef] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs sm:text-sm">
              <span className="text-gray-500">Progress: <span className="font-medium">{progress}%</span></span>
              <span className={`px-2 py-0.5 rounded-full font-medium ${status === "uploading" ? "bg-blue-100 text-blue-700" : status === "paused" ? "bg-yellow-100 text-yellow-700" : status === "complete" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                style={{minWidth:'60px',textAlign:'center'}}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
              {error && <span className="text-red-500 font-medium">{error}</span>}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {status === "idle" && (
                <button className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition" onClick={() => upload(file)} type="button">Start Upload</button>
              )}
              {status === "uploading" && (
                <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition" onClick={pause} type="button">Pause</button>
              )}
              {status === "paused" && (
                <button className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition" onClick={() => resume(file)} type="button">Resume</button>
              )}
              {status === "error" && isOnline && (
                <button className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition" onClick={() => retry(file)} type="button">Retry</button>
              )}
              {(status === "complete" || status === "idle") && (
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition" onClick={clear} type="button">Clear</button>
              )}
            </div>
          </div>
        </div>
      )}
      {!file && resumeInfo && (
        <div className="mt-4">
          <div>Found incomplete upload: {resumeInfo.fileName}</div>
          <button className="btn bg-blue-600 text-white px-3 py-1 rounded mt-2" onClick={() => fileInputRef.current.click()} type="button">Resume Upload</button>
        </div>
      )}
      {/* Upload Success Popup */}
      {showSuccessPopup && uploadedFile && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <img src="/check-mark-button-svgrepo-com.svg" alt="Upload Success" className="mx-auto mb-2 w-12 h-12" />
            <h2 className="text-lg font-medium mb-2 text-green-700">Upload Successful</h2>
            <p className="text-gray-600 mb-3 text-sm">Your file has been uploaded.</p>
            <p className="text-xs mb-1 text-gray-500">{truncateFileName(uploadedFile.fileName)}</p>
            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded px-3 py-2 text-sm mb-2">
              <span className="font-mono tracking-widest text-blue-700 text-base">{uploadedFile.uniqueCode}</span>
              <button
                onClick={() => navigator.clipboard.writeText(uploadedFile.uniqueCode)}
                className="text-xs text-blue-600 font-medium hover:underline px-2 py-1 rounded transition"
                type="button"
              >
                Copy
              </button>
            </div>
            <button
              className="bg-green-100 hover:bg-green-200 text-green-700 py-2 px-4 rounded-md mt-2 w-full font-medium transition"
              onClick={() => setShowSuccessPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default FileUpload;
