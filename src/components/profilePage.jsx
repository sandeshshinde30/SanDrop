import { useEffect, useState } from "react";
import { FaUserCircle, FaSignOutAlt, FaFileAlt, FaChartBar, FaCopy, FaDownload, FaRegClock, FaSearch, FaCheckCircle, FaUserShield } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import config from "../url.js";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useRef } from "react";
import { Tooltip as ReactTooltip } from 'react-tooltip';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CFE"];

// StatCard component
const StatCard = ({ icon, label, value, bgColor, borderColor, shadow = "", iconPadding = "" }) => (
  <div className={`flex items-center border border-blue-200 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-4 py-3 bg-white ${shadow}`}>
    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${bgColor} mr-4 ${iconPadding}`}>
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <span className="text-lg font-bold text-gray-800 break-words">{value}</span>
    </div>
  </div>
);

// SkeletonStatCard component
const SkeletonStatCard = ({ color }) => (
  <div className={`h-20 bg-${color}/30 rounded-xl w-full`} />
);

// SectionDivider component for consistent section breaks
const SectionDivider = ({ label }) => label ? (
  <div className="flex items-center max-w-4xl mx-auto my-8">
    <div className="flex-grow h-[2px] bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.05)]" />
    <span className="mx-4 text-xs text-blue-500 font-semibold uppercase tracking-wider">{label}</span>
    <div className="flex-grow h-[2px] bg-gradient-to-l from-blue-200 via-blue-400 to-blue-200 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.05)]" />
  </div>
) : (
  <div className="max-w-4xl mx-auto my-8 h-[2px] bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.05)]" />
);

const ProfilePage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [stats, setStats] = useState(null);
    const [search, setSearch] = useState("");
    const [copySuccess, setCopySuccess] = useState("");
    const emailRef = useRef();
    // Add new state for copy feedback and loading
    const [emailCopied, setEmailCopied] = useState(false);
    const [codeCopied, setCodeCopied] = useState({});
    const [loadingFiles, setLoadingFiles] = useState(true);
    // Add sorting state and handler
    const [sortOption, setSortOption] = useState('newest');
    // Pagination state and logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else {
            fetchFiles(user.email);
            fetchStats(user.email);
        }
    }, [navigate]);

    const fetchFiles = async (email) => {
        setLoadingFiles(true);
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
        } finally {
            setLoadingFiles(false);
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

    // Add getFriendlyType helper inside the component
    const getFriendlyType = (mime) => {
        if (!mime) return 'Unknown';
        if (mime.includes('pdf')) return 'PDF';
        if (mime.includes('zip') || mime.includes('rar')) return 'Archive';
        if (mime.startsWith('image/')) return 'Image';
        if (mime.startsWith('video/')) return 'Video';
        if (mime.startsWith('audio/')) return 'Audio';
        return mime.split('/')[1]?.toUpperCase() || mime;
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
    // Update getExpiryCountdown to return compact text
    const getExpiryCountdown = (expiry) => {
        const now = new Date();
        const exp = new Date(expiry);
        const diff = exp - now;
        if (diff <= 0) return "Expired";
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days > 0) return `${days}d left`;
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        if (hours > 0) return `${hours}h left`;
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        return `${mins}m left`;
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

    // Fix file download function to use direct fileUrl and fileName (previous working method)
    const handleDownload = async (file) => {
        try {
            const response = await fetch(file.fileUrl);
            if (!response.ok) throw new Error('Download failed');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download file');
        }
    };

    // Add sorting dropdown above the table
    const sortFiles = (files) => {
        switch (sortOption) {
            case 'oldest':
                return [...files].sort((a, b) => new Date(a.uploadedAt) - new Date(b.uploadedAt));
            case 'name-az':
                return [...files].sort((a, b) => a.fileName.localeCompare(b.fileName));
            case 'name-za':
                return [...files].sort((a, b) => b.fileName.localeCompare(a.fileName));
            case 'size-asc':
                return [...files].sort((a, b) => a.fileSize - b.fileSize);
            case 'size-desc':
                return [...files].sort((a, b) => b.fileSize - a.fileSize);
            case 'newest':
            default:
                return [...files].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
        }
    };
    const sortedFiles = sortFiles(filteredFiles);
    // Remove pagination state and logic

    // Update copy handlers
    const handleEmailCopy = () => {
        navigator.clipboard.writeText(user?.email);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 1200);
    };
    const handleCodeCopy = (id) => {
        navigator.clipboard.writeText(id);
        setCodeCopied({...codeCopied, [id]: true});
        setTimeout(() => setCodeCopied(prev => ({...prev, [id]: false})), 1200);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100/80 to-blue-300/60 py-8 px-2 md:px-8 relative overflow-x-hidden">
            {/* Glassmorphism background pattern */}
            <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            {/* Profile Card */}
            <div className="max-w-4xl mx-auto mb-4 bg-white/90 backdrop-blur-md border border-blue-200 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] animate-fade-in flex flex-col md:flex-row gap-6 md:gap-10 items-center p-6 md:p-8">
                {/* Avatar + Info */}
                <div className="flex flex-col items-center md:items-start w-full md:max-w-xs text-center md:text-left">
                    <div className="relative flex-shrink-0">
                        <FaUserCircle className="text-blue-300 w-24 md:w-28 h-24 md:h-28 border border-blue-300 rounded-full bg-white" />
                        <span className="absolute bottom-2 right-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white text-xs px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                            {user?.username === "admin" ? (
                                <>
                                    <FaUserShield className="inline mr-1" /> Admin
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle className="inline mr-1" /> User
                                </>
                            )}
                        </span>
                    </div>
                    <h2 className="mt-3 text-2xl font-bold text-gray-800">{user?.username}</h2>
                    <div className="mt-1 flex items-center gap-2 text-gray-600 text-sm break-all">
                        <p ref={emailRef}>{user?.email}</p>
                        <button
                            onClick={handleEmailCopy}
                            className={`group relative flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-300 ml-1`}
                            aria-label="Copy email"
                        >
                            {emailCopied ? <FaCheckCircle className="text-base" /> : <FaCopy className="text-base" />}
                            <span className="absolute bottom-[-1.8rem] left-1/2 -translate-x-1/2 text-xs bg-gray-700 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {emailCopied ? "Copied!" : "Copy"}
                            </span>
                        </button>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-1.5 inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition focus-visible:ring-2 focus-visible:ring-offset-1"
                        aria-label="Logout"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
                {/* Stats */}
                {stats ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <StatCard
                            icon={<FaFileAlt className="text-blue-400 text-2xl" />}
                            label="Total Files"
                            value={stats.totalFiles[0]?.count || 0}
                            bgColor="bg-blue-50"
                            borderColor="border-blue-100"
                            shadow="shadow-md"
                            iconPadding="p-2"
                        />
                        <StatCard
                            icon={<FaChartBar className="text-green-400 text-2xl" />}
                            label="Total Storage"
                            value={`${((stats.totalStorage[0]?.total || 0) / (1024 * 1024)).toFixed(1)} MB`}
                            bgColor="bg-green-50"
                            borderColor="border-green-100"
                            shadow="shadow-md"
                            iconPadding="p-2"
                        />
                        <StatCard
                            icon={<FaRegClock className="text-yellow-400 text-2xl" />}
                            label="Last Upload"
                            value={stats.lastUpload[0]?.uploadedAt ? formatDate(stats.lastUpload[0].uploadedAt) : "N/A"}
                            bgColor="bg-yellow-50"
                            borderColor="border-yellow-100"
                            shadow="shadow-md"
                            iconPadding="p-2"
                        />
                        <StatCard
                            icon={<FaUserCircle className="text-purple-400 text-2xl" />}
                            label="Avg. File Size"
                            value={`${((stats.avgFileSize[0]?.avg || 0) / (1024 * 1024)).toFixed(1)} MB`}
                            bgColor="bg-purple-50"
                            borderColor="border-purple-100"
                            shadow="shadow-md"
                            iconPadding="p-2"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 w-full animate-pulse">
                        <SkeletonStatCard color="blue-100" />
                        <SkeletonStatCard color="green-100" />
                        <SkeletonStatCard color="yellow-100" />
                        <SkeletonStatCard color="purple-100" />
                    </div>
                )}
            </div>
            {/* Labeled divider (Statistics) */}
            <SectionDivider label="Statistics" />
            {/* Charts & Stats */}
            {stats && (
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 animate-fade-in">
                    {/* Pie Chart and Downloads Chart side by side */}
                    <div className="flex flex-col md:flex-row gap-8 w-full col-span-2">
                        {/* Pie Chart */}
                        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 flex-1 flex flex-col items-center justify-center" style={{ minWidth: 300, width: '100%' }}>
                            <h3 className="text-base font-semibold text-gray-700 mb-3">Top File Types</h3>
                            {stats.topFileTypes?.length ? (
                                <div className="w-full overflow-x-auto">
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
                            ) : (
                                <p className="text-sm text-gray-500">No file type data to display</p>
                            )}
                        </div>
                        {/* Downloads Chart */}
                        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 flex-1 flex flex-col items-center justify-center" style={{ minWidth: 300, width: '100%' }}>
                            <h3 className="text-base font-semibold text-gray-700 mb-3">Downloads (Last 12 Months)</h3>
                            {stats.downloadPerMonth?.length ? (
                                <div className="w-full overflow-x-auto">
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
                            ) : (
                                <p className="text-sm text-gray-500">No download data to display</p>
                            )}
                        </div>
                    </div>
                    {/* Uploads Chart - full width */}
                    <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-3 md:p-4 flex flex-col items-center md:col-span-2 w-full overflow-x-auto mb-4">
                        <h3 className="text-base font-semibold text-gray-700 mb-3">Uploads (Last 6 Months)</h3>
                        {stats.uploadPerMonth?.length ? (
                            <div className="w-full">
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={stats.uploadPerMonth} barCategoryGap={12} margin={{ left: 0, right: 0, top: 10, bottom: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="_id" tick={{ fontSize: 12 }} interval={0} angle={-20} dy={10} height={40} tickLine={false} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend wrapperStyle={{ marginTop: 8 }} />
                                        <Bar dataKey="count" fill="#0096C7" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No upload data to display</p>
                        )}
                    </div>
                </div>
            )}
            {/* Gradient divider for section breaks */}
            <SectionDivider />
            {/* File Table */}
            <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md p-3 md:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-xl mt-4 mb-4 animate-fade-in w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                    <h2 className="text-xl font-bold text-[#0096C7]">All My Files</h2>
                    <div className="flex items-center gap-2">
                        <label htmlFor="sort" className="text-sm text-gray-600 font-medium">Sort by:</label>
                        <select
                            id="sort"
                            value={sortOption}
                            onChange={e => setSortOption(e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        >
                            <option value="newest">Newest</option>
                            <option value="oldest">Oldest</option>
                            <option value="name-az">Name (A-Z)</option>
                            <option value="name-za">Name (Z-A)</option>
                            <option value="size-asc">Size (asc)</option>
                            <option value="size-desc">Size (desc)</option>
                        </select>
                    </div>
                </div>
                <div className="w-full overflow-x-auto">
                    <table className="w-full lg:table-fixed border-separate border-spacing-0 rounded-xl overflow-hidden text-sm md:text-base">
                        <colgroup>
                            <col className="w-12" />
                            <col className="min-w-[200px]" />
                            <col className="w-24" />
                            <col className="w-24" />
                            <col className="w-32" />
                            <col className="w-32" />
                            <col className="w-32" />
                            <col className="w-40" />
                        </colgroup>
                        <thead className="bg-blue-100 text-blue-800 sticky top-0 z-10 shadow-sm border-b border-blue-200 text-sm font-medium">
                            <tr>
                                <th className="p-4 font-semibold text-left">#</th>
                                <th className="p-4 font-semibold text-left">Name</th>
                                <th className="p-4 font-semibold text-center">Type</th>
                                <th className="p-4 font-semibold text-right">Size</th>
                                <th className="p-4 font-semibold text-center">Uploaded</th>
                                <th className="p-4 font-semibold text-center hidden sm:table-cell">Expiry</th>
                                <th className="p-4 font-semibold text-center">Code</th>
                                <th className="p-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingFiles ? (
                                <tr>
                                    <td colSpan="8" className="py-8 text-center">
                                        <div className="flex justify-center items-center flex-col gap-2">
                                            <div className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full" />
                                            <p className="text-sm text-gray-500">Loading your files...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : sortedFiles.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="p-4 text-center text-gray-500">
                                        No files found
                                    </td>
                                </tr>
                            ) : (
                                sortedFiles.map((file, index) => (
                                    <tr key={file._id} className={index % 2 === 0 ? "bg-gray-50 hover:bg-blue-100/40" : "bg-white hover:bg-blue-100/40"}>
                                        <td className="p-4 text-center align-middle text-sm font-normal text-gray-800">{index + 1}</td>
                                        <td className="p-4 align-middle whitespace-nowrap text-sm font-semibold text-gray-900">
                                            <div className="flex items-center gap-3">
                                                {getFileIcon(file.fileType)}
                                                <span className="truncate max-w-[160px] md:max-w-[240px]" title={file.fileName}>{truncateFileName(file.fileName, 30)}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center align-middle text-sm font-normal text-blue-800">
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">{getFriendlyType(file.fileType)}</span>
                                        </td>
                                        <td className="p-4 text-right align-middle text-sm font-normal text-gray-800">{file.fileSize < 1024 ? `${file.fileSize} B` : file.fileSize < 1024 * 1024 ? `${(file.fileSize / 1024).toFixed(1)} KB` : `${(file.fileSize / (1024 * 1024)).toFixed(1)} MB`}</td>
                                        <td className="p-4 text-center align-middle text-sm font-normal text-gray-700">{formatDate(file.uploadedAt)}</td>
                                        <td className="p-4 text-center align-middle text-xs font-normal text-gray-500 hidden sm:table-cell">{getExpiryCountdown(file.expiresAt)}</td>
                                        <td className="p-4 text-center align-middle text-xs font-mono font-normal text-blue-700">
                                            <span className="bg-blue-100 px-2 py-1 rounded font-mono cursor-pointer hover:bg-blue-200 transition truncate" onClick={() => handleCodeCopy(file.uniqueCode)} title="Copy Code">
                                                {file.uniqueCode || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-4 flex gap-2 justify-center align-middle">
                                            <button
                                                onClick={() => handleDownload(file)}
                                                className="group relative flex items-center justify-center w-12 h-12 p-2 rounded-lg bg-[#0096C7] hover:bg-[#0077B6] text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-300"
                                                aria-label={`Download ${file.fileName}`}
                                            >
                                                <FaDownload className="text-lg" />
                                                <span className="absolute bottom-[-1.8rem] text-xs bg-gray-700 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    Download
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => handleCodeCopy(file.uniqueCode)}
                                                className={`group relative flex items-center justify-center w-12 h-12 p-2 rounded-lg ${
                                                    codeCopied[file.uniqueCode]
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                } transition-colors focus-visible:ring-2 focus-visible:ring-blue-300`}
                                                aria-label={`Copy code for ${file.fileName}`}
                                            >
                                                {codeCopied[file.uniqueCode] ? <FaCheckCircle className="text-lg" /> : <FaCopy className="text-lg" />}
                                                <span className="absolute bottom-[-1.8rem] text-xs bg-gray-700 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    {codeCopied[file.uniqueCode] ? "Copied!" : "Copy"}
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Remove pagination controls below the table */}
            </div>
            {/* Floating Action Button (visual only) */}
            <button
                className="fixed bottom-8 right-4 md:right-8 z-50 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4 transition-transform flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
                title="Go to Home"
                aria-label="Upload (coming soon)"
                onClick={() => navigate('/')}
            >
                <FaFileAlt className="w-6 h-6" />
                <span className="hidden md:inline">Upload</span>
            </button>
        </div>
    );
};

export default ProfilePage;
