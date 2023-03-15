const express = require("express");
const {
  createOrderController,
  delOrderController,
  getOrderController,
  updateOrderController,
  listOrderController,
} = require("../controllers/order");
const router = express.Router();

router.post("/", createOrderController);
router.delete("/:_id", delOrderController);
router.get("/:_id", getOrderController);
router.patch("/:_id", updateOrderController);
router.get("/", listOrderController);

module.exports = router;
