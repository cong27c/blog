const { MAIL_SECRET, MAIL_EXPIRES_IN } = require("@/config/auth");
const transporter = require("@/config/mailer");
const { User } = require("@/models");
const jwtService = require("@/services/jwt.service");
const loadEmailTemplate = require("@/utils/loadEmailTemplate");

async function sendVerifyEmailJob(job) {
  try {
    const { userId, type } = JSON.parse(job.payload);
    const { dataValues: user } = await User.findByPk(userId);

    const mailToken = jwtService.generateAccessToken(
      user.id,
      MAIL_SECRET,
      MAIL_EXPIRES_IN
    );
    const template = await loadEmailTemplate(
      type,
      "auth/verification",
      mailToken
    );

    await transporter.sendMail({
      from: "nguyenvancongcbg1@gmail.com",
      subject: "Verify email",
      to: user.email,
      html: template,
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = sendVerifyEmailJob;
