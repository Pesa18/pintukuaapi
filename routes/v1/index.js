const express = require("express");
const router = express.Router();

const authPage = require("./pages/auth");
const appPage = require("./pages/appData");

router.use("/v1/auth", authPage);
router.use("/v1/app", appPage);

module.exports = router;
