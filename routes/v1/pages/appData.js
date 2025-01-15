var express = require("express");
var router = express.Router();
const authMiddleware = require("../../../middleware/authMiddleware");
const appData = require("../../../controllers/appDataController");
const validateUUID = require("../../../middleware/uuidMiddleware");

router.get("/mobile", appData.mobileApp);
router.get("/getarticles", appData.getAllArticles);
router.post("/article/:slug/view", appData.articleViews);

module.exports = router;
