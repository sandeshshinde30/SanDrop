import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes.js";

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use("/api", routes);

mongoose.connect("mongodb://127.0.0.1:27017/sandrop")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.listen(8000, () => console.log("Server running on port 8000"));


