import generateSignedUrl from "../s3.js";

export const getSignedUrlController = async (req, res) => {
  try {
    const fileName = req.body.fileName;
    if (!fileName) return res.status(400).json({ error: "Missing fileName" });

    const url = await generateSignedUrl(fileName);
    res.json({ url });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    res.status(500).json({ error: "Server error" });
  }
};
