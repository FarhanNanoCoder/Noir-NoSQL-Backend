const express = require("express");
const {
  createUserController,
  delUserController,
  getUserController,
} = require("../controllers/user");
const router = express.Router();

router.post("/", createUserController);
router.delete("/:_id", delUserController);
router.get("/:_id", getUserController);

module.exports = router;
