var express = require("express");
var router = express.Router();
const authMiddleware = require("../../../middleware/authMiddleware");
const authController = require("../../../controllers/authController");

router.post("/register", authController.register);
router.post("/ceklogin", authController.cekLogin);
router.post("/login", authController.login);
router.post("/loginwithgoogle", authController.loginWithGoogle);
router.post("/verifyOtp", authController.verifyOtp);
router.post("/resendotp", authController.resendOTP);
router.post("/refreshtoken", authMiddleware, authController.refreshTokens);
router.post("/forgot-password", authController.forgotPassword);
router.post("/new-password", authMiddleware, authController.resetPassword);

module.exports = router;
