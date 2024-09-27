const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const transporter = require("./sendEmail");
const prisma = new PrismaClient();

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
        .status(404)
        .json({ status: "Gagal", message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ Status: "Gagal", message: "Invalid email or password" });
    }

    if (user.email_verified_at == null) {
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
    const token = jwt.sign(user, "your_jwt_secret", {
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

    const mailOptions = {
      from: "asepalamin42@gmail.com", // Pengirim
      to: "ciawigebangkua@gmail.com", // Penerima
      subject: "Test Email", // Subjek email
      text: "Hello, this is a test email sent from Node.js!", // Konten email
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Error occurred: " + error.message);
      }
      console.log("Email sent: " + info.response);
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
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error });
  }
};
