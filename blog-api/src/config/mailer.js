const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: "congnvf8208@fullstack.edu.vn",
    pass: "exgk bfny jkcv wwcu",
  },
});

module.exports = transporter;
