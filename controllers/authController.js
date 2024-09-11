const { PrismaClient } = require("@prisma/client");
const { json } = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

exports.cekLogin = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      return res.status(201).json({
        status: "error",
        message: "Email tidak ditemukan!",
        data: { login: false },
      });
    }
    res.status(200).json({
      status: "success",
      message: "Email ditemukan",
      data: { login: true, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res
        .status(404)
        .json({ status: "Gagal", message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ Status: "Gagal", message: "Invalid email or password" });
    }

    // Jika berhasil, buat token JWT
    const token = jwt.sign({ userId: user.uuid }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        login: true,
        token: token,
        user: {
          email: user.email,
          uuid: user.uuid,
          name: user.name,
        },
      },
    });

    // res.json({ Berhasil: "euy" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
};

exports.loginWithGoogle = async (req, res) => {
  const { token } = req.body;
  const jwtDecode = jwt.decode(token);
  console.log(jwtDecode);

  try {
    const user = await prisma.users.findUnique({
      where: {
        email: jwtDecode.email,
      },
    });
    console.log(user);

    if (!user) {
      return res.status(201).json({
        status: "Gagal",
        message: "User not found",
        data: {
          login: false,
          user: {
            email: jwtDecode.email,
          },
        },
      });
    }

    // Jika berhasil, buat token JWT
    const token = jwt.sign({ userId: user.uuid }, "your_jwt_secret", {
      expiresIn: "1h",
    });

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        login: true,
        token: token,
        user: {
          email: user.email,
          uuid: user.uuid,
          name: user.name,
        },
      },
    });

    // res.json({ Berhasil: "euy" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
};
