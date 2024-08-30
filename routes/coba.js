var express = require("express");
var router = express.Router();
const userController = require("../controllers/userController");

/* GET home page. */
router.get("/coba", function (req, res, next) {
  res.render("coba", { title: userController.getAllUsers });
});

module.exports = router;
