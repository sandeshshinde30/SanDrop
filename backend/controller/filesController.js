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
