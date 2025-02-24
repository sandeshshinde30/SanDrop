import React from "react";
import FileUpload from "../components/fileUpload";
import FileDownload from "../components/fileDownload";
import Navbar from "../components/navBar";

function HomePage() {
    return (
        <div className="flex flex-col bg-gray-100 min-h-screen">
        <div className="flex flex-col lg:flex-row justify-center items-center lg:h-screen px-6 md:px-10 lg:px-20 py-10">
         
          <div className="w-80 lg:w-2/5 flex justify-center  flex-col bg-white shadow-lg rounded-lg p-6 sm:p-8 mb-6 lg:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0077B6] mb-4">
              Sandrop Features
            </h2>
  
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Guest Users</h3>
              <ul className="text-sm text-gray-600 list-disc pl-4">
                <li>Upload <strong>one</strong> file at a time</li>
                <li>Storage for <strong>2 days</strong></li>
                <li>Max file size: <strong>10MB</strong></li>
              </ul>
            </div>
  
            <div>
              <h3 className="text-lg font-semibold">Logged-in Users</h3>
              <ul className="text-sm text-gray-600 list-disc pl-4">
                <li>Upload <strong>multiple</strong> files</li>
                <li>Storage for <strong>21 days</strong></li>
                <li>Max file size: <strong>100MB</strong></li>
              </ul>
            </div>
          </div>
       
          <div className="w-full lg:w-3/5 flex flex-col justify-center items-center gap-6">
            <FileUpload />
            <FileDownload />
          </div>
        </div>
      </div>
    );
}

export default HomePage;
