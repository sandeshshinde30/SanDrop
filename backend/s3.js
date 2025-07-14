// s3.js (backend)
import aws from 'aws-sdk';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { promisify } from 'util';

dotenv.config();

const randomBytes = promisify(crypto.randomBytes);

const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: "v4"
});

const generateSignedUrl = async (originalFileName, fileType) => {
  try {
    const uniquePrefix = Date.now();
    const key = `${uniquePrefix}-${originalFileName}`;

    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: 300,
      ContentType: fileType || 'application/octet-stream',
      // ContentDisposition: `attachment; filename="${originalFileName}"`, // Removed to avoid signature mismatch
    };

    const signedUrl = await s3.getSignedUrlPromise('putObject', params);
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return null;
  }
};

export const initiateMultipartUpload = async (fileName, fileType) => {
  const key = `${Date.now()}-${fileName}`;
  const params = {
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
  };
  const { UploadId } = await s3.createMultipartUpload(params).promise();
  return { uploadId: UploadId, key };
};

export const getMultipartPresignedUrl = async (key, uploadId, partNumber) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    UploadId: uploadId,
    PartNumber: partNumber,
    // ContentType: fileType, // REMOVED
  };
  const url = await s3.getSignedUrlPromise('uploadPart', params);
  return url;
};

export const completeMultipartUpload = async (key, uploadId, parts) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: parts },
  };
  return await s3.completeMultipartUpload(params).promise();
};
  
  
  export default generateSignedUrl;
  
