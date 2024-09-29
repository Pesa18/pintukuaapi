const nodemailer = require("nodemailer");

// Buat transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Anda bisa menggunakan layanan email lain seperti 'hotmail', 'yahoo', dll.
  auth: {
    user: "asepalamin42@gmail.com", // Ganti dengan email Anda
    pass: "zotn jvxt czbl brcw", // Ganti dengan password email Anda
  },
});

const sendEmail = async (
  to = "ciawigebangkua@gmail.com",
  subject = "Test Email",
  text = "Test"
) => {
  try {
    const mailOptions = {
      from: "asepalamin42@gmail.com", // Pengirim
      to: to, // Penerima
      subject: subject, // Subjek email
      text: text, // Konten email
    };
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return false;
      }
      return true;
    });

    return true;
  } catch (error) {
    return false;
  }
};

module.exports = sendEmail;
