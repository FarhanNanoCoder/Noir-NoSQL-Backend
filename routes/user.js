const express = require("express");
const {
  createUserController,
  delUserController,
  getUserController,
  updateUserController,
} = require("../controllers/user");
const router = express.Router();

router.post("/", createUserController);
router.delete("/:_id", delUserController);
router.get("/:_id", getUserController);
router.patch("/:_id", updateUserController);

module.exports = router;
