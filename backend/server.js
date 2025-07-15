import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://vogueprism.com','https://sandrop.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.options('*', cors()); 

app.use(express.json());
app.use("/api", routes);

const MONGO_URI = process.env.MONGO_URI || "mongodb://admin:password@localhost:27018/sandropdb?authSource=admin";

// const MONGO_URI  = "mongodb://localhost:27017/sandropdb";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`Connected to MongoDB at ${MONGO_URI}`))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(3000, () => console.log("Server running on port 3000"));
