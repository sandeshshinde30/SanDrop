import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    fileUrl: { type: String, required: true },
    uniqueCode: { type: String, required: true, unique: true },
    email: { type: String, required: true }, 
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    downloadCount: { type: Number, default: 0 },
    sharedWith: [{ type: String }]
});


const File = mongoose.model('File', fileSchema);
export default File;
