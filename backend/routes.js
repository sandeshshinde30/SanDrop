import express from 'express';
import { getSignedUrlController } from './controller/imageController.js';
import { storeFileInfo } from './controller/storeFileController.js';
import { getFile } from './controller/downloadFileController.js';
import { registerUser, loginUser } from './controller/authController.js';  
import { getFilesByEmail } from "./controller/filesController.js"
const routes = express.Router();

routes.post('/image-url', getSignedUrlController);
routes.post('/store-file', storeFileInfo);
routes.get('/get-file/:uniqueCode', getFile); 
routes.post('/register', registerUser); 
routes.post('/login', loginUser);
routes.post("/files", getFilesByEmail);


export default routes;
