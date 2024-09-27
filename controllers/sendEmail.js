const nodemailer = require("nodemailer");

// Buat transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // Anda bisa menggunakan layanan email lain seperti 'hotmail', 'yahoo', dll.
  auth: {
    user: "asepalamin42@gmail.com", // Ganti dengan email Anda
    pass: "zotn jvxt czbl brcw", // Ganti dengan password email Anda
  },
});

// // Konfigurasi email
// const mailOptions = {
//   from: "your-email@gmail.com", // Pengirim
//   to: "recipient-email@example.com", // Penerima
//   subject: "Test Email", // Subjek email
//   text: "Hello, this is a test email sent from Node.js!", // Konten email
// };

// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     return console.log("Error occurred: " + error.message);
//   }
//   console.log("Email sent: " + info.response);
// });

module.exports = transporter;
