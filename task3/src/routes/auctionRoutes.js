import express from "express";

import {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction
} from "../controllers/auctionController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Anyone can view auctions
router.get("/", getAllAuctions);
router.get("/:id", getAuctionById);

// Only sellers and admins can create auctions
router.post(
  "/",
  authMiddleware,
  roleMiddleware("SELLER", "ADMIN"),
  upload.array("images"),
  createAuction
);

// Only sellers and admins can update auctions
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware("SELLER", "ADMIN"),
  updateAuction
);

// Only sellers and admins can delete auctions
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("SELLER", "ADMIN"),
  deleteAuction
);

export default router;
