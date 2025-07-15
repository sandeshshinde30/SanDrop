import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import https from "https";
import http from "http";
import fs from "fs";
import routes from "./routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Whitelisted frontend domains
const allowedOrigins = [
  'http://localhost:5173',
  'https://vogueprism.com',
  'https://sandrop.vercel.app'
];

// CORS config
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.options('*', cors()); // Preflight

app.use(express.json());
app.use("/api", routes);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://admin:password@localhost:27018/sandropdb?authSource=admin";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`✅ Connected to MongoDB at ${MONGO_URI}`))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Load SSL certs from Let's Encrypt
const sslOptions = {
  key: fs.readFileSync("/etc/letsencrypt/live/backend.vogueprism.com/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/backend.vogueprism.com/fullchain.pem")
};

// HTTPS Server on port 443
https.createServer(sslOptions, app).listen(443, () => {
  console.log("🔐 HTTPS server running at https://backend.vogueprism.com");
});

