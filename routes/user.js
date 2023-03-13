const express = require("express");
const { createUserController,delUserController } = require("../controllers/user");
const router = express.Router();

router.post("/", createUserController);
router.delete("/:_id", delUserController);

module.exports = router;
