import generateSignedUrl from "../s3.js";

export const getSignedUrlController = async (req, res) => {
  try {
    const fileName = req.body.fileName;
    const fileType = req.body.fileType;
    if (!fileName) return res.status(400).json({ error: "Missing fileName" });
    if (!fileType) return res.status(400).json({ error: "Missing fileType" });

    const url = await generateSignedUrl(fileName, fileType);
    res.json({ url });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    res.status(500).json({ error: "Server error" });
  }
};
