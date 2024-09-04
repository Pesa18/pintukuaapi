const express = require("express");
const router = express.Router();

const authPage = require("./pages/auth");

router.use("/v1/auth", authPage);

module.exports = router;
