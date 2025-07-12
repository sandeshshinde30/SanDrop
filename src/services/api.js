// services/api.js
import axios from 'axios';
import config from "../url.js";

export const getSignedUrl = async (fileName) => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}/image-url`, {
        fileName,
      });
      return response.data;
    } catch (error) {
      console.log("Error while calling the API", error.message);
      return null;
    }
  };
      

export const uploadFile = async (url, file) => {
  try {
    return await axios.put(url, file, {
      headers: {
        "Content-Type": file.type || 'application/octet-stream'
      }
    });
  } catch (error) {
    console.log('Error while uploading file', error.message);
    return error.response?.data;
  }
};
