const express = require("express");
const { createUserController } = require("../controllers/user");
const router = express.Router();

router.post("/", createUserController);

module.exports = router;
