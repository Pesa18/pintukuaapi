const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sendEmail = require("./sendEmail");

// Fungsi untuk membuat OTP
const generateOTP = (length = 4) => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

// Fungsi untuk menyimpan OTP ke database
const createOTP = async (userId, email) => {
  const otpCode = generateOTP(); // Generate OTP dengan panjang 6 digit
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 3); // OTP berlaku selama 10 menit

  const otp = await prisma.otps.create({
    data: {
      otp: otpCode,
      user_id: userId, // Kaitkan dengan user ID, jika diperlukan
      expires_at: expiresAt,
    },
  });

  const isSendtoemail = await sendEmail(
    email,
    "Kode OTP",
    `Ini adalah kode otp kamu: ${otp.otp}`
  );

  if (!isSendtoemail) {
    return false;
  }
  return true;
};

const validOtp = async (userId, inputOtp) => {
  const otpRecord = await prisma.otps.findFirst({
    where: {
      user_id: userId,
      otp: inputOtp,
      expires_at: {
        gt: new Date(), // Hanya ambil OTP yang belum kadaluwarsa
      },
    },
  });

  if (!otpRecord) {
    return false; // OTP tidak valid atau kadaluwarsa
  }

  if (otpRecord.is_used) {
    return false;
  }

  await prisma.otps.update({
    where: {
      id: otpRecord.id,
    },
    data: {
      is_used: true,
    },
  });

  return true; // OTP valid
};

module.exports = { createOTP, validOtp };
