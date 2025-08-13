const path = require("path");
const ejs = require("ejs");

async function loadEmailTemplate(type, template, data) {
  const emailPath = path.join(__dirname, "..", "emails", `${template}.ejs`);

  const token = data.access_token;
  const variables = {
    verify: {
      title: "Verify Your Email",
      message: "Click the button below to verify your email address.",
      buttonText: "Verify Email",
      url: `http://localhost:5173/verify?token=${token}`,
    },
    "forgot-password": {
      title: "Reset Your Password",
      message: "Click the button below to reset your password.",
      buttonText: "Reset Password",
      url: `http://localhost:5173/reset-password?token=${token}`,
    },
  };

  if (!variables[type]) {
    throw new Error(`Invalid template type: ${type}`);
  }

  const finalData = { ...data, ...variables[type] };

  const html = await ejs.renderFile(emailPath, finalData);
  return html;
}

module.exports = loadEmailTemplate;
