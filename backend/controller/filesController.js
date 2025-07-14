import File from "../models/fileModel.js";

export const getFilesByEmail = async (req, res) => {
    try {
        console.log("Request received with body:", req.body);
        const { email } = req.body;  // Extract email from body

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const files = await File.find({ email });

        if (!files.length) {
            return res.status(404).json({ message: "No files found for this email" });
        }

        res.status(200).json({ success: true, files });
    } catch (error) {
        console.error("Error fetching files:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUserStats = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    try {
        const pipeline = [
            { $match: { email } },
            {
                $facet: {
                    totalFiles: [{ $count: "count" }],
                    totalStorage: [{ $group: { _id: null, total: { $sum: "$fileSize" } } }],
                    lastUpload: [{ $sort: { uploadedAt: -1 } }, { $limit: 1 }, { $project: { uploadedAt: 1 } }],
                    topDownloaded: [
                        { $sort: { downloadCount: -1 } },
                        { $limit: 3 },
                        { $project: { fileName: 1, downloadCount: 1 } }
                    ],
                    topFileTypes: [
                        { $group: { _id: "$fileType", count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 5 }
                    ],
                    recentUploads: [
                        { $sort: { uploadedAt: -1 } },
                        { $limit: 5 },
                        { $project: { fileName: 1, uploadedAt: 1 } }
                    ],
                    uploadPerMonth: [
                        { $match: { uploadedAt: { $gte: sixMonthsAgo } } },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m", date: "$uploadedAt" } },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ],
                    downloadPerMonth: [
                        { $match: { uploadedAt: { $gte: sixMonthsAgo } } },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m", date: "$uploadedAt" } },
                                downloads: { $sum: "$downloadCount" }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ],
                    avgFileSize: [
                        { $group: { _id: null, avg: { $avg: "$fileSize" } } }
                    ],
                    mostShared: [
                        { $unwind: "$sharedWith" },
                        { $group: { _id: "$_id", count: { $sum: 1 }, fileName: { $first: "$fileName" } } },
                        { $sort: { count: -1 } },
                        { $limit: 1 }
                    ]
                }
            }
        ];

        const stats = await File.aggregate(pipeline);
        res.json(stats[0]);
    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
