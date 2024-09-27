var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../../../middleware/authMiddleware");
const authController = require("../../../controllers/authController");

router.post("register");
router.post("/ceklogin", authController.cekLogin);
router.post("/login", authController.login);

module.exports = router;
