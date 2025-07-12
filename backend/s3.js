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

const generateSignedUrl = async (originalFileName) => {
    try {
      const uniquePrefix = Date.now();
      const key = `${uniquePrefix}-${originalFileName}`;
  
      const params = {
        Bucket: bucketName,
        Key: key,
        Expires: 300,
        ContentType: 'application/octet-stream',
        ContentDisposition: `attachment; filename="${originalFileName}"`, // 👈 Important
      };
  
      const signedUrl = await s3.getSignedUrlPromise('putObject', params);
      return signedUrl;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      return null;
    }
  };
  
  
  export default generateSignedUrl;
  
