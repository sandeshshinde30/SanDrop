import { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import config from "../url.js";

const ProfilePage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            fetchFiles(user.email);
        }
    }, [navigate]);

    const fetchFiles = async (email) => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/files`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setFiles(data.files);
            } else {
                console.error("No files found");
                setFiles([]);
            }
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    const formatDate = (dateString) => {
        const options = { day: "2-digit", month: "short", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-GB", options).replace(",", "");
    };

    const truncateFileName = (name, length = 15) => {
        return name.length > length ? name.substring(0, length) + "..." : name;
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-auto md:w-1/4 md:m-0 mx-5 mt-2 rounded-md p-4 flex flex-col gap-4 bg-white shadow-lg md:min-h-screen">
            <div className="p-6 rounded-lg flex flex-col items-center">
                <FaUserCircle className="text-gray-400 w-20 h-20" />
                <h2 className="text-lg font-bold mt-2">{user?.username}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
            </div>

            <div className="p-6 rounded-lg flex flex-col gap-2">
                <button className="w-full flex items-center px-4 py-2 rounded-md text-left bg-[#0096C7] text-white">
                    📂 My Files
                </button>
                <button
                    className="w-full flex items-center px-4 py-2 rounded-md text-left text-red-500 hover:bg-gray-200"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt className="mr-2" /> Logout
                </button>
            </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 p-4 md:p-6 overflow-auto">
            <h2 className="text-2xl font-bold text-[#0096C7] mb-4">My Files</h2>
            <div className="bg-white p-4 md:p-6 shadow-xl rounded-lg overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse border border-gray-400">
                    <thead className="bg-[#0096C7] text-sm text-white text-left">
                        <tr>
                            <th className="p-3 md:p-4 border border-gray-300">Sr No.</th>
                            <th className="p-3 md:p-4 border border-gray-300">Name</th>
                            <th className="p-3 md:p-4 border border-gray-300">File Type</th>
                            <th className="p-3 md:p-4 border border-gray-300">Size</th>
                            <th className="p-3 md:p-4 border border-gray-300">Uploaded</th>
                            <th className="p-3 md:p-4 border border-gray-300">Expiry</th>
                            <th className="p-3 md:p-4 border border-gray-300">Code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.length > 0 ? (
                            files.map((file, index) => (
                                <tr key={file._id} className="border text-xs md:text-sm border-gray-300 text-left hover:bg-gray-100 transition-all">
                                    <td className="p-3 md:p-4 border border-gray-300">{index + 1}</td>
                                    <td className="p-3 md:p-4 border border-gray-300 font-medium text-[#0077B6] whitespace-nowrap">
                                        {truncateFileName(file.fileName)}
                                    </td>
                                    <td className="p-3 md:p-4 border border-gray-300">{truncateFileName(file.fileType)}</td>
                                    <td className="p-3 md:p-4 border border-gray-300">
                                        {file.fileSize < 1024
                                            ? `${file.fileSize} B`
                                            : file.fileSize < 1024 * 1024
                                            ? `${(file.fileSize / 1024).toFixed(2)} KB`
                                            : `${(file.fileSize / (1024 * 1024)).toFixed(2)} MB`}
                                    </td>
                                    <td className="p-3 md:p-4 border border-gray-300">{formatDate(file.uploadedAt)}</td>
                                    <td className="p-3 md:p-4 border border-gray-300">{formatDate(file.expiresAt)}</td>
                                    <td className="p-3 md:p-4 border border-gray-300 text-center">
                                        {file.uniqueCode || "N/A"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-4 text-center text-gray-500">No files available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    );
};

export default ProfilePage;
