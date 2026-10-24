import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  startingPrice: {
    type: Number,
    required: true,
    min: 0
  },

  images: {
    type: [String],
    default: []
  },

  startTime: {
    type: Date,
    required: true
  },

  endTime: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ["UPCOMING", "ACTIVE", "ENDED"],
    default: "UPCOMING"
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

const Auction = mongoose.model("Auction", auctionSchema);

export default Auction;
