const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    trim: true,
    index: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
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

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Purchase", purchaseSchema);
