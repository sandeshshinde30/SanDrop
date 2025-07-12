import React, { useState, useRef, useEffect } from "react";
import "../index.css";
import { uploadFile, getSignedUrl } from "../services/api";
import axios from "axios";
import { Plus, Send } from "lucide-react"; 
import { FileText, Image, File, FileVideo, FileAudio, FileArchive, FileCode } from "lucide-react";
import config from "../url.js";

const FileUpload = () => {
  const [files, setFiles] = useState([]);  // Store multiple files
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
const [uploadedFiles, setUploadedFiles] = useState([]); // Store uploaded files

  
  const fileInputRef = useRef();

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


  useEffect(() => {
    const getData = async () => {
      // const response = await getSignedUrl();
      // setUrl(response.url);
    };
    getData();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files); 
    const maxFileSize = user ? 100 * 1024 * 1024 : 10 * 1024 * 1024; 

    const validFiles = selectedFiles.filter(file => file.size <= maxFileSize);

    if (validFiles.length === 0) {
        setError(`File size exceeds the limit of ${user ? "100MB" : "10MB"}.`);
        return;
    }

    setFiles(user ? validFiles : [validFiles[0]]);  
    setError("");
};

const generateUniqueCode = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

const handleUpload = async () => {
  if (files.length === 0) {
    setError("No file selected.");
    return;
  }

  setLoading(true);

  try {
    const response = await Promise.all(files.map(file => getSignedUrl(file.name)));
    const uploadedFileData = await Promise.all(files.map(async (file, index) => {
      const uploadUrl = response[index].url;
      const fileKey = response[index].key;

      await uploadFile(uploadUrl, file);
      const finalUrl = uploadUrl.split("?")[0];

      const uniqueCode = generateUniqueCode();
      const userEmail = user ? user.email : "guest@sandrop.com";

      await axios.post(`${config.API_BASE_URL}/store-file`, {
        fileUrl: finalUrl,
        uniqueCode: uniqueCode,
        email: userEmail,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      return { fileName: file.name, uniqueCode };
    }));

    setUploadedFiles(uploadedFileData);
    setShowSuccessPopup(true);
    setFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";

  } catch (err) {
    console.error("Error uploading files:", err);
    alert("Error uploading files.");
  }

  setLoading(false);
};


const truncateFileName = (name, length = 15) => {
  return name.length > length ? name.substring(0, length) + "..." : name;
};



  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <form
        className="bg-white p-6 rounded-lg shadow-md w-80  flex flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
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
    multiple={!!user} 
/>

        </div>

      
        {files.length > 0 && (
  <div className="w-full">
    {files.map((file, index) => (
      <div key={index} className="flex items-center justify-between bg-gray-200 px-3 py-2 rounded-lg relative group mb-2">
        <div className="flex items-center gap-2">
          {getFileIcon(file.type)}
          <span 
            className="text-gray-700 text-sm truncate max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap"
            title={file.name}
          >
            {file.name}
          </span>
        </div>

        <span className="text-gray-500 text-xs group-hover:hidden">
          {formatFileSize(file.size)}
        </span>

        <button 
          onClick={() => setFiles(files.filter((_, i) => i !== index))} 
          className="text-red-500 hover:text-red-700 hidden group-hover:block"
          title="Remove file"
        >
          ❌
        </button>
      </div>
    ))}

    <div className="w-full mt-4">
      <button
        type="button"
        className="w-full flex items-center justify-center text-white bg-[#0077B6] py-2 px-4 rounded-lg hover:bg-[#023E8A] focus:ring-2 focus:ring-blue-500"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? (
          <div className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-md font-medium">Send</h1>
            <Send size={18} />
          </div>
        )}
      </button>
    </div>
  </div>
)}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>

    

{showSuccessPopup && (
  <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
      <h2 className="text-lg font-semibold mb-3">Upload Successful! </h2>
      <p className="text-gray-700 mb-4">Your files have been uploaded.</p>

      <div className="text-left text-sm bg-gray-100 p-3 rounded-lg">
        {uploadedFiles.map((file, index) => (
          <p key={index}>
            {truncateFileName(file.fileName)} - <strong className="tracking-wider">Code: {file.uniqueCode}</strong>
          </p>
        ))}
      </div>

      <button
        className="bg-green-500  text-white py-2 px-4 rounded-lg mt-4 hover:bg-green-700"
        onClick={() => setShowSuccessPopup(false)}
      >
        OK
      </button>
    </div>
  </div>
)}


    </div>
  );
};

export default FileUpload;
