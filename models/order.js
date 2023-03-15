const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    trim: true,
    index: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
    trim: true,
    index: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  note: {
    type: String,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "completed",
      "cancelled",
      "refunded",
      "rejected",
      "placed",
    ],
    default: "placed",
    // uppercase: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
