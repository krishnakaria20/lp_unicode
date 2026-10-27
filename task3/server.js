import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import pino from "pino";

import auctionRoutes from "./src/routes/auctionRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();

const app = express();
const logger = pino({
  transport: {
    target: "pino-pretty"
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auctions", auctionRoutes);
app.use("/api/auth", authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    logger.info("MongoDB connected");

    app.listen(process.env.PORT || 5000, () => {
      logger.info(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    logger.error(error, "MongoDB connection failed");
  });
