var express = require("express");
var router = express.Router();
const authMiddleware = require("../../../middleware/authMiddleware");
const appData = require("../../../controllers/appDataController");

router.get("/mobile", authMiddleware, appData.mobileApp);

module.exports = router;
