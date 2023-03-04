const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  subscribeDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  subscribedToChannel: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Subscriber", subscriberSchema);
