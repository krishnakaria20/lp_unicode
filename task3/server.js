import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import auctionRoutes from "./src/routes/auctionRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auctions", auctionRoutes);
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");

    // Start the server after connecting
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });
