const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price:{
    type:Number,
    reuired:true,
  },
  type: {
    type: String,
    required: true,
    default: "accessories",
    uppercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
