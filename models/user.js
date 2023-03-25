const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  avatar: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    required: true,
    // index: true,
  },
  role: {
    type: Number,
    min: 0,
    max: 2,
    default: 0,
    required: true,
    // index: true,
  },
  email: {
    type: String,
    // index: true,
  },
  phone: {
    type: String,
    required: true,
    // index: true,
  },
  address: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
