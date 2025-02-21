const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("./sendEmail");
const prisma = new PrismaClient();
const { createOTP, validOtp } = require("./otpGenerator");

exports.cekLogin = async (req, res) => {
  try {
    const user = await prisma.user_accounts.findUnique({
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
    const user = await prisma.user_accounts.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res
        .status(200)
        .json({ status: "Gagal", message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ Status: "Gagal", message: "Invalid email or password" });
    }

    if (user.email_verified_at == null) {
      const otpCreated = await createOTP(user.uuid, user.email);

      if (!otpCreated) {
        return res.status(500).json({ status: "error", error: error });
      }
      return res.status(201).json({
        Status: "Gagal",
        isVerified: false,
        message: "Email not Verified",
        data: {
          user: {
            email: user.email,
            uuid: user.uuid,
          },
        },
      });
    }
    // Jika berhasil, buat token JWT
    const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {
      expiresIn: "1m",
    });

    const refreshToken = jwt.sign(user, process.env.JWT_SECRET_KEY, {
      expiresIn: "1m",
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
        refreshToken: refreshToken,
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
    const user = await prisma.user_accounts.findUnique({
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

    const token_ = jwt.sign(user, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(user, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        login: true,
        token: token_,
        user: {
          email: user.email,
          uuid: user.uuid,
          name: user.name,
        },
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
};

exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body.values;

  console.log(email);

  try {
    const existingUser = await prisma.user_accounts.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(200).json({
        status: "not success",
        isExists: true,
        message: "'Email already exists!'",
      });
    }

    var salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const user = await prisma.user_accounts.create({
      data: {
        name: name,
        email: email,
        password: passwordHash,
        phone: phone,
      },
    });
    const otpSuccess = await createOTP(user.uuid, user.email);

    if (!otpSuccess) {
      return res.status(500).json({ status: "error", error: error });
    }
    return res.status(200).json({
      status: "success",
      message: "user has been created",
      data: {
        user: {
          email: user.email,
          uuid: user.uuid,
        },
      },
    });
  } catch (error) {
    // throw error;
    return res.status(500).json({ status: "error", error: error });
  }
};

exports.verifyOtp = async (req, res) => {
  const { uuid, otp } = req.body;
  try {
    const valid = await validOtp(uuid, otp);

    if (!valid) {
      return res.status(200).json({
        status: "not valid",
        isverified: false,
        message: "OTP not verified",
      });
    }
    await prisma.user_accounts.update({
      where: {
        uuid: uuid,
      },
      data: {
        email_verified_at: new Date(),
      },
    });
    return res
      .status(200)
      .json({ status: "valid", isverified: true, message: "OTP Verified" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
};
exports.resendOTP = async (req, res) => {
  const { email, uuid } = req.body;
  try {
    const otpCreated = await createOTP(uuid, email);
    if (!otpCreated) {
      return res.status(200).json({
        success: false,
        status: "error",
        message: "gagal Membuat OTP",
      });
    }
    return res.status(200).json({ success: true, message: "berhasil" });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error });
  }
};

exports.refreshTokens = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
    const user = await prisma.user_accounts.findUnique({
      where: {
        uuid: decoded.uuid,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m",
    });

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.log("error", error);

    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user_accounts.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(200).json({
        status: "error",
        message: "Email not found",
      });
    }
    const otpCreated = await createOTP(user.uuid, user.email);
    if (!otpCreated) {
      return res.status(500).json({ status: "error", error: error });
    }
    const token = jwt.sign(user, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.status(200).json({
      status: "success",
      message: "OTP has been sent to your email",
      data: {
        token: token,
        user: {
          email: user.email,
          uuid: user.uuid,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body.values;
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const uuid = decoded.uuid;
    var salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const user = await prisma.user_accounts.update({
      where: {
        uuid: uuid,
      },
      data: {
        password: passwordHash,
      },
    });
    return res.status(200).json({
      status: "success",
      message: "Password has been reset",
      data: {
        user: {
          email: user.email,
          uuid: user.uuid,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ status: "error", error: error });
  }
};
