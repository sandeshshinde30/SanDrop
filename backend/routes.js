import express from 'express';
import { getSignedUrlController } from './controller/imageController.js';
import { storeFileInfo } from './controller/storeFileController.js';
import { getFile } from './controller/downloadFileController.js';
import { registerUser, loginUser } from './controller/authController.js';  
import { getFilesByEmail } from "./controller/filesController.js"
import { getUserStats } from "./controller/filesController.js"
import * as multipartController from './controller/multipartController.js';
const routes = express.Router();

routes.post('/image-url', getSignedUrlController);
routes.post('/store-file', storeFileInfo);
routes.get('/get-file/:uniqueCode', getFile); 
routes.post('/register', registerUser); 
routes.post('/login', loginUser);
routes.post("/files", getFilesByEmail);
routes.post("/user-stats", getUserStats);

// Multipart upload endpoints
routes.post('/multipart/initiate', multipartController.initiate);
routes.post('/multipart/part-url', multipartController.getPartUrl);
routes.post('/multipart/complete', multipartController.complete);

export default routes;
