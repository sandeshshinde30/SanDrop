import React from "react";
import FileUpload from "../components/fileUpload";
import FileDownload from "../components/fileDownload";
import { FaCloudUploadAlt, FaCloudDownloadAlt, FaUserShield, FaUserFriends } from "react-icons/fa";

function HomePage() {
    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex flex-col">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center justify-center py-16 px-4 md:px-0 bg-gradient-to-r from-[#e0f2fe] to-[#f1f5f9]">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0077B6] mb-4 text-center drop-shadow-lg tracking-tight">
          <span className="text-[#0096C7]">SanDrop</span> File Sharing
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 text-center max-w-2xl">
          Effortlessly upload, share, and download your files securely. Fast, simple, and free for everyone.
        </p>
        <a href="#upload-section" className="inline-block bg-gradient-to-r from-[#0096C7] to-[#0077B6] text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:from-[#0077B6] hover:to-[#0096C7] transition mb-4">
          Get Started
        </a>
      </section>
      {/* Features Section */}
      <section className="w-full flex flex-col items-center justify-center mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">
          {/* Guest Users Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center min-h-[220px] border border-blue-100">
            <FaUserShield className="text-4xl text-[#0096C7] mb-3" />
            <h3 className="text-xl font-bold mb-2 text-[#0077B6]">Guest Users</h3>
            <ul className="w-full space-y-2 mt-2">
              <li className="flex items-center gap-2 text-base text-gray-700">
                <span className="inline-block w-2 h-2 bg-[#0096C7] rounded-full"></span>
                <span>Upload <span className="font-semibold text-[#0077B6]">one file</span> at a time</span>
              </li>
              <li className="flex items-center gap-2 text-base text-gray-700">
                <span className="inline-block w-2 h-2 bg-[#0096C7] rounded-full"></span>
                <span>Storage for <span className="font-semibold text-[#0077B6]">2 days</span></span>
              </li>
              <li className="flex items-center gap-2 text-base text-gray-700">
                <span className="inline-block w-2 h-2 bg-[#0096C7] rounded-full"></span>
                <span>Max file size: <span className="font-semibold text-[#0077B6]">10MB</span></span>
              </li>
              </ul>
            </div>
          {/* Logged-in Users Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center min-h-[220px] border border-blue-100">
            <FaUserFriends className="text-4xl text-[#0077B6] mb-3" />
            <h3 className="text-xl font-bold mb-2 text-[#0096C7]">Logged-in Users</h3>
            <ul className="w-full space-y-2 mt-2">
              <li className="flex items-center gap-2 text-base text-gray-700">
                <span className="inline-block w-2 h-2 bg-[#0077B6] rounded-full"></span>
                <span>Upload <span className="font-semibold text-[#0096C7]">multiple files</span></span>
              </li>
              <li className="flex items-center gap-2 text-base text-gray-700">
                <span className="inline-block w-2 h-2 bg-[#0077B6] rounded-full"></span>
                <span>Storage for <span className="font-semibold text-[#0096C7]">21 days</span></span>
              </li>
              <li className="flex items-center gap-2 text-base text-gray-700">
                <span className="inline-block w-2 h-2 bg-[#0077B6] rounded-full"></span>
                <span>Max file size: <span className="font-semibold text-[#0096C7]">100MB</span></span>
              </li>
              </ul>
          </div>
        </div>
      </section>
      {/* Upload/Download Section */}
      <section id="upload-section" className="w-full flex flex-col items-center justify-center mb-12">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center min-h-[260px] border border-blue-100">
            <FaCloudUploadAlt className="text-4xl text-[#0096C7] mb-2" />
            <h3 className="text-lg font-semibold mb-2">Upload Files</h3>
            <div className="w-full flex-1 flex flex-col justify-center">
              <FileUpload />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center min-h-[260px] border border-blue-100">
            <FaCloudDownloadAlt className="text-4xl text-[#0077B6] mb-2" />
            <h3 className="text-lg font-semibold mb-2">Download Files</h3>
            <div className="w-full flex-1 flex flex-col justify-center">
            <FileDownload />
            </div>
          </div>
        </div>
      </section>
      </div>
    );
}

export default HomePage;
