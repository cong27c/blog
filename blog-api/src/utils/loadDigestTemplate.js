const path = require("path");
const ejs = require("ejs");

async function loadDigestTemplate(template, data) {
  const emailPath = path.join(__dirname, "..", "emails", `${template}.ejs`);
  return ejs.renderFile(emailPath, data);
}

module.exports = loadDigestTemplate;
