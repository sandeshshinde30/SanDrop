import { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaFileAlt, FaChartBar, FaCopy, FaDownload, FaRegClock, FaSearch, FaCheckCircle, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import config from "../url.js";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useRef } from "react";
import { Tooltip as ReactTooltip } from 'react-tooltip';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFE"];

const ProfilePage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [stats, setStats] = useState(null);
    const [search, setSearch] = useState("");
    const [copySuccess, setCopySuccess] = useState("");
    const emailRef = useRef();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            fetchFiles(user.email);
            fetchStats(user.email);
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
                setFiles([]);
            }
        } catch (error) {
            setFiles([]);
        }
    };

    const fetchStats = async (email) => {
        try {
            const response = await fetch(`${config.API_BASE_URL}/user-stats`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            setStats(data);
        } catch (error) {
            setStats(null);
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

    // Helper to extract file extension/type from MIME type
    const getFileTypeLabel = (mime) => {
        if (!mime) return '';
        const parts = mime.split('/');
        return parts[1]?.toUpperCase() || parts[0]?.toUpperCase() || mime;
    };

    const filteredFiles = files.filter(f =>
        f.fileName.toLowerCase().includes(search.toLowerCase()) ||
        (f.uniqueCode && f.uniqueCode.toString().includes(search))
    );
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        setCopySuccess("Copied!");
        setTimeout(() => setCopySuccess(""), 1200);
    };
    const getExpiryCountdown = (expiry) => {
        const now = new Date();
        const exp = new Date(expiry);
        const diff = exp - now;
        if (diff <= 0) return "Expired";
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days > 0) return `Expires in ${days} day${days > 1 ? "s" : ""}`;
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        if (hours > 0) return `Expires in ${hours} hour${hours > 1 ? "s" : ""}`;
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        return `Expires in ${mins} min${mins > 1 ? "s" : ""}`;
    };
    const getFileIcon = (type) => {
        if (!type) return <FaFileAlt className="text-gray-400" />;
        if (type.startsWith("image/")) return <FaFileAlt className="text-blue-400" />;
        if (type.startsWith("video/")) return <FaFileAlt className="text-red-400" />;
        if (type.startsWith("audio/")) return <FaFileAlt className="text-green-400" />;
        if (type.includes("pdf")) return <FaFileAlt className="text-red-600" />;
        if (type.includes("zip") || type.includes("rar")) return <FaFileAlt className="text-yellow-600" />;
        return <FaFileAlt className="text-gray-400" />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100/80 to-blue-300/60 py-8 px-2 md:px-8 relative overflow-x-hidden">
            {/* Glassmorphism background pattern */}
            <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            {/* Profile Card */}
            <div className="max-w-4xl mx-auto mb-8 animate-fade-in">
                <div className="flex flex-col md:flex-row items-center bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 gap-8 md:gap-12 border border-blue-100 relative">
                    <div className="flex flex-col items-center md:items-start min-w-0 flex-1">
                        <div className="relative mb-2">
                            <FaUserCircle className="text-blue-300 w-28 h-28 border-4 border-blue-200 rounded-full shadow-xl bg-white/80" />
                            <span className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                                {user?.username === "admin" ? <FaUserShield className="inline mr-1" /> : <FaCheckCircle className="inline mr-1" />} {user?.username === "admin" ? "Admin" : "User"}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 drop-shadow-sm">{user?.username}</h2>
                        <div className="flex items-center gap-2 mb-2">
                            <p ref={emailRef} className="text-gray-500 text-sm select-all cursor-pointer" onClick={() => handleCopy(user?.email)} data-tooltip-id="email-tooltip">{user?.email}</p>
                            <button className="text-blue-500 hover:text-blue-700" onClick={() => handleCopy(user?.email)} title="Copy Email" data-tooltip-id="email-tooltip"><FaCopy /></button>
                            {copySuccess && <span className="text-green-500 text-xs ml-2 animate-pulse">{copySuccess}</span>}
                            <ReactTooltip id="email-tooltip" place="top" content="Copy email" />
                        </div>
                        <button
                            className="flex items-center gap-2 px-4 py-2 mt-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition shadow"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                    {stats ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full min-w-0 flex-1">
                            <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-4 flex flex-col items-center shadow hover:scale-105 transition-transform min-w-0 break-words">
                                <span className="text-xs text-gray-500">Total Files</span>
                                <span className="text-2xl font-bold text-blue-700 flex items-center gap-2 break-words"><FaFileAlt />{stats.totalFiles[0]?.count || 0}</span>
                            </div>
                            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-4 flex flex-col items-center shadow hover:scale-105 transition-transform min-w-0 break-words">
                                <span className="text-xs text-gray-500">Total Storage</span>
                                <span className="text-2xl font-bold text-green-700 flex items-center gap-2 break-words">{((stats.totalStorage[0]?.total || 0) / (1024 * 1024)).toFixed(2)} MB</span>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-4 flex flex-col items-center shadow hover:scale-105 transition-transform min-w-0 break-words">
                                <span className="text-xs text-gray-500">Last Upload</span>
                                <span className="text-lg font-semibold text-yellow-700 break-words">{stats.lastUpload[0]?.uploadedAt ? formatDate(stats.lastUpload[0].uploadedAt) : "N/A"}</span>
                            </div>
                            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4 flex flex-col items-center shadow hover:scale-105 transition-transform min-w-0 break-words">
                                <span className="text-xs text-gray-500">Avg. File Size</span>
                                <span className="text-2xl font-bold text-purple-700 flex items-center gap-2 break-words">{((stats.avgFileSize[0]?.avg || 0) / (1024 * 1024)).toFixed(2)} MB</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 animate-pulse">Loading stats...</div>
                    )}
                </div>
            </div>
            <div className="max-w-4xl mx-auto border-t border-blue-100 my-8" />
            {/* Charts & Stats */}
            {stats && (
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 animate-fade-in">
                    {/* Pie Chart and Downloads Chart side by side */}
                    <div className="flex flex-col md:flex-row gap-8 w-full col-span-2">
                        {/* Pie Chart */}
                        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 flex-1 flex flex-col items-center justify-center">
                            <div className="mb-2 text-base font-bold text-blue-700">File Types</div>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={stats.topFileTypes.map(ft => ({ ...ft, label: getFileTypeLabel(ft._id) }))}
                                        dataKey="count"
                                        nameKey="label"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        innerRadius={40}
                                        fill="#8884d8"
                                        label={({ label }) => label}
                                    >
                                        {stats.topFileTypes.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name, props) => [`${value}`, 'Count']} />
                                    <Legend
                                        iconType="circle"
                                        wrapperStyle={{ paddingTop: 16 }}
                                        content={({ payload }) => (
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {payload && payload.map((entry, idx) => (
                                                    <div
                                                        key={entry.value}
                                                        className="flex items-center gap-2 px-3 py-1 rounded-full shadow-sm text-xs font-semibold"
                                                        style={{
                                                            background: COLORS[idx % COLORS.length] + '22',
                                                            color: COLORS[idx % COLORS.length],
                                                            border: `1px solid ${COLORS[idx % COLORS.length]}`,
                                                        }}
                                                    >
                                                        <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                                                        {entry.value}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Downloads Chart */}
                        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 flex-1 flex flex-col items-center justify-center">
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={stats.downloadPerMonth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="_id" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="downloads" stroke="#FF8042" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* Uploads Chart - full width */}
                    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 flex flex-col items-center md:col-span-2">
                        <h3 className="font-bold text-lg mb-4 text-blue-700 flex items-center gap-2">
                            <FaChartBar className="text-[#0096C7]" /> Uploads (Last 6 Months)
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={stats.uploadPerMonth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="_id" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#0096C7" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
            <div className="max-w-4xl mx-auto border-t border-blue-100 my-8" />
            {/* Recent Uploads */}
            {stats ? (
                <div className="max-w-4xl mx-auto mb-8 animate-fade-in">
                    <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6">
                        <h3 className="font-bold text-lg mb-4 text-blue-700 flex items-center gap-2">
                            <FaFileAlt className="w-6 h-6 text-[#0096C7]" />
                            Recent Uploads
                        </h3>
                        <ul className="divide-y divide-blue-50">
                            {stats.recentUploads.map((file, idx) => (
                                <li key={idx} className="flex items-center gap-4 py-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                        {getFileIcon(file.fileType)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-800">{truncateFileName(file.fileName, 24)}</div>
                                        <div className="text-xs text-gray-500">{formatDate(file.uploadedAt)}</div>
                                    </div>
                                    <a
                                        href={file.fileUrl}
                                        download={file.fileName}
                                        className="ml-auto bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1 transition-colors shadow"
                                        title="Download"
                                        data-tooltip-id={`recent-download-${idx}`}
                                    >
                                        <FaDownload /> Download
                                    </a>
                                    <ReactTooltip id={`recent-download-${idx}`} place="top" content="Download file" />
                                    <span className="ml-4 text-xs text-gray-400 flex items-center gap-1"><FaRegClock /> {getExpiryCountdown(file.expiresAt)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ) : (
                <div className="max-w-4xl mx-auto mb-8 animate-pulse text-gray-400">Loading recent uploads...</div>
            )}
            <div className="max-w-4xl mx-auto border-t border-blue-100 my-8" />
            {/* File Table */}
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur p-4 md:p-6 shadow-2xl rounded-2xl overflow-x-auto mt-8 animate-fade-in">
                <h2 className="text-xl font-bold text-[#0096C7] mb-4">All My Files</h2>
                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[600px] border-separate border-spacing-0 rounded-xl overflow-hidden text-sm md:text-base">
                        <thead className="bg-[#0077B6] text-white sticky top-0 z-10 shadow">
                            <tr>
                                <th className="p-4 font-semibold">#</th>
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Type</th>
                                <th className="p-4 font-semibold">Size</th>
                                <th className="p-4 font-semibold">Uploaded</th>
                                <th className="p-4 font-semibold">Expiry</th>
                                <th className="p-4 font-semibold">Code</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.length > 0 ? (
                                files.map((file, index) => (
                                    <tr key={file._id} className={index % 2 === 0 ? "bg-blue-50/40 hover:bg-blue-100/60 transition-colors" : "bg-white hover:bg-blue-50/60 transition-colors"}>
                                        <td className="p-4 text-center align-top">{index + 1}</td>
                                        <td className="p-4 font-medium text-[#0077B6] flex items-center gap-2 align-top max-w-[240px] whitespace-normal break-all overflow-hidden">
                                            <span className="flex-shrink-0">{getFileIcon(file.fileType)}</span>
                                            <span className="flex-1 overflow-hidden text-ellipsis" style={{display: 'block'}}>{truncateFileName(file.fileName, 48)}</span>
                                        </td>
                                        <td className="p-4 align-top break-all max-w-[120px]">{truncateFileName(file.fileType)}</td>
                                        <td className="p-4 align-top">{file.fileSize < 1024 ? `${file.fileSize} B` : file.fileSize < 1024 * 1024 ? `${(file.fileSize / 1024).toFixed(2)} KB` : `${(file.fileSize / (1024 * 1024)).toFixed(2)} MB`}</td>
                                        <td className="p-4 align-top">{formatDate(file.uploadedAt)}</td>
                                        <td className="p-4 align-top">{getExpiryCountdown(file.expiresAt)}</td>
                                        <td className="p-4 text-center align-top"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-mono cursor-pointer hover:bg-blue-200 transition" onClick={() => handleCopy(file.uniqueCode)} title="Copy Code" data-tooltip-id={`code-tooltip-${index}`}>{file.uniqueCode || "N/A"}</span><ReactTooltip id={`code-tooltip-${index}`} place="top" content="Copy code" /></td>
                                        <td className="p-4 flex gap-2 justify-center align-top">
                                            <a href={file.fileUrl} download={file.fileName} className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1 transition-colors shadow" title="Download" data-tooltip-id={`download-tooltip-${index}`}><FaDownload /> Download</a>
                                            <ReactTooltip id={`download-tooltip-${index}`} place="top" content="Download file" />
                                            <button className="bg-gray-200 hover:bg-gray-400 text-gray-700 px-2 py-1 rounded flex items-center gap-1" onClick={() => handleCopy(file.uniqueCode)} title="Copy Code"><FaCopy /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="p-4 text-center text-gray-400">No files found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Floating Action Button (visual only) */}
            <button className="fixed bottom-8 right-4 md:right-8 z-50 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full shadow-lg p-4 hover:scale-110 transition-transform flex items-center gap-2" style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }} title="Upload (visual only)" disabled><FaFileAlt className="w-6 h-6" /><span className="hidden md:inline">Upload</span></button>
        </div>
    );
};

export default ProfilePage;
