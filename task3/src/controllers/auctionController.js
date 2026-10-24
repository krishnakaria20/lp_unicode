import Auction from "../models/Auction.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

// Create an auction
export const createAuction = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      startingPrice,
      startTime,
      endTime
    } = req.body;

    if (
      !title || !description || !category ||
      startingPrice == null || !startTime || !endTime
    ) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (
      Number(startingPrice) < 0 ||
      !Number.isFinite(Number(startingPrice))
    ) {
      return res.status(400).json({
        message: "Invalid starting price"
      });
    }

    if (
      isNaN(new Date(startTime)) ||
      isNaN(new Date(endTime)) ||
      new Date(endTime) <= new Date(startTime)
    ) {
      return res.status(400).json({
        message: "Invalid auction timings"
      });
    }

    // Upload images to Cloudinary
    const images = await Promise.all(
      (req.files || []).map((file) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );

          Readable.from(file.buffer).pipe(stream);
        });
      })
    );

    // Set status based on the auction time
    const now = new Date();
    let status = "ACTIVE";

    if (now < new Date(startTime)) status = "UPCOMING";
    else if (now >= new Date(endTime)) status = "ENDED";

    const auction = await Auction.create({
      title,
      description,
      category,
      startingPrice: Number(startingPrice),
      startTime,
      endTime,
      images,
      seller: req.userId,
      status
    });

    res.status(201).json(auction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all auctions
export const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find();

    auctions.forEach((auction) => {
      const now = new Date();

      if (now < auction.startTime) auction.status = "UPCOMING";
      else if (now >= auction.endTime) auction.status = "ENDED";
      else auction.status = "ACTIVE";
    });

    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get one auction
export const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const now = new Date();

    if (now < auction.startTime) auction.status = "UPCOMING";
    else if (now >= auction.endTime) auction.status = "ENDED";
    else auction.status = "ACTIVE";

    res.status(200).json(auction);
  } catch (error) {
    res.status(400).json({ message: "Invalid auction ID" });
  }
};

// Update an auction
export const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    if (
      req.userRole !== "ADMIN" &&
      auction.seller.toString() !== req.userId
    ) {
      return res.status(403).json({
        message: "You can only manage your own auctions"
      });
    }

    const fields = [
      "title", "description", "category",
      "startingPrice", "startTime", "endTime"
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        auction[field] = req.body[field];
      }
    });

    const now = new Date();

    if (now < auction.startTime) auction.status = "UPCOMING";
    else if (now >= auction.endTime) auction.status = "ENDED";
    else auction.status = "ACTIVE";

    await auction.save();

    res.status(200).json(auction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an auction
export const deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    if (
      req.userRole !== "ADMIN" &&
      auction.seller.toString() !== req.userId
    ) {
      return res.status(403).json({
        message: "You can only manage your own auctions"
      });
    }

    await auction.deleteOne();

    res.status(200).json({
      message: "Auction deleted successfully"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
