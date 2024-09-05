var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../../../middleware/authMiddleware");
const authController = require("../../../controllers/authController");

router.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  let user = users.find((user) => user.username === username);
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  user = { id: users.length + 1, username, password: hashedPassword };
  users.push(user);

  const payload = {
    user: {
      id: user.id,
      username: user.username,
    },
  };

  const token = jwt.sign(payload, "your_jwt_secret_key", { expiresIn: "1h" });

  res.status(201).json({ token });
});

router.post("/ceklogin", authController.cekLogin);
router.post("/login", authController.login);

module.exports = router;
