import {
  initiateMultipartUpload,
  getMultipartPresignedUrl,
  completeMultipartUpload,
} from '../s3.js';

export const initiate = async (req, res) => {
  try {
    const { fileName, fileType } = req.body;
    const { uploadId, key } = await initiateMultipartUpload(fileName, fileType);
    res.json({ uploadId, key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPartUrl = async (req, res) => {
  try {
    const { key, uploadId, partNumber } = req.body;
    const url = await getMultipartPresignedUrl(key, uploadId, partNumber);
    res.json({ url });
  } catch (err) {
    console.error("Error in getPartUrl:", err); // Log the real error
    res.status(500).json({ error: err.message });
  }
};

export const complete = async (req, res) => {
  try {
    const { key, uploadId, parts } = req.body;
    console.log("/multipart/complete called with:", { key, uploadId, parts }); // Log request body
    const result = await completeMultipartUpload(key, uploadId, parts);
    res.json({ result });
  } catch (err) {
    console.error("Error in complete:", err); // Log full error
    res.status(500).json({ error: err.message, stack: err.stack });
  }
}; 