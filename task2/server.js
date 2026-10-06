import express from "express";

import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";

const app = express();

app.use(express.json());

app.use("/api/auth" , authRoutes);

app.listen(5000 , () => {
    console.log("Server running on port 5000");
});

connectDB();