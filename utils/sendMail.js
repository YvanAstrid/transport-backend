// Exemple avec nodemailer (à installer)
const nodemailer = require('nodemailer');

async function sendMail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // ou autre service
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
  await transporter.sendMail({ from: process.env.MAIL_USER, to, subject, text });
}

module.exports = sendMail;