import React, { useState, useRef } from "react";
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
  

  return (
    <div className="w-full flex flex-col items-center justify-center bg-gray-100 ">
      <div className="bg-white p-6 rounded-lg shadow-md w-80 max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[#0077B6]">Receive File</h2>
        <div className="flex justify-center space-x-2">
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
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
        <button
          type="button"
          className="w-full flex items-center justify-center text-white bg-[#0077B6] py-2 px-4 rounded-lg hover:bg-[#023E8A] focus:ring-2 focus:ring-blue-500 mt-4"
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></div>
          ) : (
            <h1 className="text-md font-medium">Receive</h1>
          )}
        </button>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-lg font-semibold mb-3">File Ready to Download</h2>
            <p className="text-gray-700 mb-4">Click the button below to download your file.</p>
            <button
  onClick={() => downloadFile(fileUrl)}
  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700"
>
  Receive File
</button>

            <button
              className="block w-full mt-3 text-gray-600 underline hover:text-gray-800"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileDownload;