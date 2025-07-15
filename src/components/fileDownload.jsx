import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import config from "../url.js";
const FileDownload = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [fileUrl, setFileUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const inputRefs = useRef([]);


  const handleChange = (index, value) => {
    if (!/^[\d]?$/.test(value)) return;
    let newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleDownload = async () => {
    const enteredCode = code.join("");
    if (!enteredCode.match(/^\d{6}$/)) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await axios.get(`${config.API_BASE_URL}/get-file/${enteredCode}`);
      setFileUrl(response.data.fileUrl);
      setShowPopup(true);
    } catch (err) {
      setError("Invalid code or file not found.");
      console.error("Error fetching file:", err);
    }
    setLoading(false);
  };

  const downloadFile = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Remove instant download effect
  // useEffect(() => {
  //   if (fileUrl) {
  //     downloadFile(fileUrl);
  //     setFileUrl("");
  //   }
  // }, [fileUrl]);

  // Download file as blob from presigned URL
  const handleBlobDownload = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      // Try to get filename from Content-Disposition or fallback
      let filename = url.split("/").pop().split("?")[0] || "file";
      const disposition = response.headers.get('Content-Disposition');
      if (disposition && disposition.indexOf('filename=') !== -1) {
        filename = disposition.split('filename=')[1].replace(/['"]/g, '').split(';')[0];
      }
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      setShowPopup(false);
    } catch (err) {
      alert('Failed to download file.');
    }
  };

  // Remove the outer card-like div. Start with the form directly.
  return (
    <form className="w-full flex flex-col gap-4 items-center" onSubmit={e => e.preventDefault()}>
      <h2 className="text-xl font-bold mb-4 text-[#0077B6]">Receive File</h2>
      <div className="flex justify-center space-x-2 mb-2">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength="1"
            className="w-10 h-12 text-center border border-gray-400 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            onPaste={(e) => {
              e.preventDefault();
              const paste = e.clipboardData.getData("text").slice(0, 6).split("");
              if (paste.every(c => /^\d$/.test(c))) {
                const newCode = [...code];
                paste.forEach((val, i) => {
                  if (i < 6) newCode[i] = val;
                });
                setCode(newCode);
                // Focus next empty input
                const nextIndex = paste.length < 6 ? paste.length : 5;
                inputRefs.current[nextIndex]?.focus();
              }
            }}
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      <button
        type="button"
        className="w-full flex items-center justify-center text-white bg-[#0077B6] py-2 px-4 rounded-lg hover:bg-[#023E8A] focus:ring-2 focus:ring-blue-500 mt-2"
        onClick={handleDownload}
        disabled={loading}
      >
        {loading ? (
          <div className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></div>
        ) : (
          <h1 className="text-md font-medium">Receive</h1>
        )}
      </button>
      {/* Popup Modal */}
      {showPopup && fileUrl && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <img src="/package-svgrepo-com.svg" alt="File Ready" className="mx-auto mb-2 w-12 h-12" />
            <h2 className="text-lg font-medium mb-2 text-green-700">File Ready to Download</h2>
            <p className="text-gray-600 mb-3 text-sm">Click the button below to download your file.</p>
            <button
              onClick={() => handleBlobDownload(fileUrl)}
              className="bg-green-100 hover:bg-green-200 text-green-700 py-2 px-4 rounded-md w-full text-sm font-medium mb-2 transition"
            >
              Download File
            </button>
            <button
              className="block w-full mt-1 text-gray-500 underline hover:text-gray-700 text-xs font-medium"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default FileDownload;