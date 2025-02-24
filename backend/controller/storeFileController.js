import File from '../models/fileModel.js';

export const storeFileInfo = async (req, res) => {
    try {
        const { fileUrl, uniqueCode, email, fileName, fileType, fileSize } = req.body;

        if (!fileUrl || !uniqueCode || !email || !fileName || !fileType || !fileSize) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        
        const expiryDays = email == "guest@sandrop.com" ? 2 : 21; 
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiryDays);

        const newFile = new File({ fileUrl, uniqueCode, email, fileName, fileType, fileSize, expiresAt });
        await newFile.save();

        res.status(201).json({ message: "File stored successfully" });
    } catch (error) {
        console.error("Error storing file:", error);
        res.status(500).json({ message: "Error storing file", error: error.message });
    }
};
