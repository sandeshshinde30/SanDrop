import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes.js";

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use("/api", routes);
const MONGO_URI = "mongodb://localhost:27017/sandropdb";
mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.listen(3000, () => console.log("Server running on port 3000"));


