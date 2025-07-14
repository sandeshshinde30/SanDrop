import File from '../models/fileModel.js';

export const getFile = async (req, res) => {
    try {
        const { uniqueCode } = req.params;
        console.log("Received uniqueCode:", uniqueCode);

        const file = await File.findOneAndUpdate(
            { uniqueCode },
            { $inc: { downloadCount: 1 } },
            { new: true }
        );

        if (!file) {
            console.log("File not found for code:", uniqueCode);
            return res.status(404).json({ message: "File not found" });
        }

        res.status(200).json({ fileUrl: file.fileUrl });
    } catch (error) {
        console.error("Error fetching file:", error);
        res.status(500).json({ message: "Error fetching file", error: error.message });
    }
};
