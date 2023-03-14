const express = require("express");
const {
  createProductController,
  delProductController,
  getProductController,
  updateProductController,
  listProductController,
} = require("../controllers/product");
const router = express.Router();

router.post("/", createProductController);
router.delete("/:_id", delProductController);
router.get("/:_id", getProductController);
router.patch("/:_id", updateProductController);
router.get("/", listProductController);

module.exports = router;
