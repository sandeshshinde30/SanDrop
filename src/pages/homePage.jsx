import React from "react";
import FileUpload from "../components/fileUpload";
import FileDownload from "../components/fileDownload";
import { FaCloudUploadAlt, FaCloudDownloadAlt, FaUserShield, FaUserFriends } from "react-icons/fa";

function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white flex flex-col">
      {/* Hero Section - Bold gradient and SVG wave */}
      <section className="relative w-full flex flex-col items-center justify-center py-14 md:py-20 px-4 sm:px-6 bg-gradient-to-r from-[#0096C7] to-[#0077B6] text-center border-b-0">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-lg tracking-tight">
          <span className="text-[#90e0ef]">SanDrop</span> File Sharing
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-7 max-w-2xl mx-auto">
          Effortlessly upload, share, and download your files securely. Fast, simple, and free for everyone.
        </p>
        <a href="#upload-section" className="inline-block bg-white text-[#0077B6] px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:bg-blue-100 hover:text-[#0096C7] transition mb-2 md:mb-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0077B6]">
          Get Started
        </a>
        
      </section>
      {/* Features Section */}
      <section className="w-full flex flex-col items-center justify-center mt-8 md:mt-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 w-full max-w-4xl mb-10">
          {/* Guest Users Card */}
          <article className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-lg transition-shadow p-6 md:p-10 flex flex-col items-center min-h-[220px] border border-blue-100 text-center">
            <FaUserShield className="text-5xl text-[#0096C7] mb-3" />
            <h3 className="text-2xl font-bold mb-2 text-[#0077B6]">Guest Users</h3>
            <ul className="w-full space-y-2 mt-2">
              {/* <li className="flex items-center gap-2 text-[1.05rem] text-gray-700 justify-center">
                <span className="inline-block w-2 h-2 bg-[#0096C7] rounded-full"></span>
                <span>Upload <span className="font-semibold text-[#0077B6]">one file</span> at a time</span>
              </li> */}
              <li className="flex items-center gap-2 text-[1.05rem] text-gray-700 justify-center">
                <span className="inline-block w-2 h-2 bg-[#0096C7] rounded-full"></span>
                <span>Storage for <span className="font-semibold text-[#0077B6]">2 days</span></span>
              </li>
              <li className="flex items-center gap-2 text-[1.05rem] text-gray-700 justify-center">
                <span className="inline-block w-2 h-2 bg-[#0096C7] rounded-full"></span>
                <span>Max file size: <span className="font-semibold text-[#0077B6]">10MB</span></span>
              </li>
            </ul>
          </article>
          {/* Logged-in Users Card */}
          <article className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-lg transition-shadow p-6 md:p-10 flex flex-col items-center min-h-[220px] border border-blue-100 text-center">
            <FaUserFriends className="text-5xl text-[#0077B6] mb-3" />
            <h3 className="text-2xl font-bold mb-2 text-[#0096C7]">Logged-in Users</h3>
            <ul className="w-full space-y-2 mt-2">
              {/* <li className="flex items-center gap-2 text-[1.05rem] text-gray-700 justify-center">
                <span className="inline-block w-2 h-2 bg-[#0077B6] rounded-full"></span>
                <span>Upload <span className="font-semibold text-[#0096C7]">multiple files</span></span>
              </li> */}
              <li className="flex items-center gap-2 text-[1.05rem] text-gray-700 justify-center">
                <span className="inline-block w-2 h-2 bg-[#0077B6] rounded-full"></span>
                <span>Storage for <span className="font-semibold text-[#0096C7]">21 days</span></span>
              </li>
              <li className="flex items-center gap-2 text-[1.05rem] text-gray-700 justify-center">
                <span className="inline-block w-2 h-2 bg-[#0077B6] rounded-full"></span>
                <span>Max file size: <span className="font-semibold text-[#0096C7]">100MB</span></span>
              </li>
            </ul>
          </article>
        </div>
      </section>
      {/* Upload/Download Section */}
      <section id="upload-section" className="w-full flex flex-col items-center justify-center mb-12 px-4 sm:px-6">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-stretch justify-center">
          <article className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-lg transition-shadow p-6 md:p-10 flex flex-col items-center min-h-[260px] border border-blue-100 text-center">
            <FaCloudUploadAlt className="text-5xl text-[#0096C7] mb-3" />
            <h3 className="text-xl md:text-2xl font-semibold mb-2">Upload Files</h3>
            <div className="w-full">
              <FileUpload />
            </div>
          </article>
          <article className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-lg transition-shadow p-6 md:p-10 flex flex-col items-center min-h-[260px] border border-blue-100 text-center">
            <FaCloudDownloadAlt className="text-5xl text-[#0077B6] mb-3" />
            <h3 className="text-xl md:text-2xl font-semibold mb-2">Download Files</h3>
            <div className="w-full">
              <FileDownload />
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
