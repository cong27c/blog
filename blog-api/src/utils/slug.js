const slugify = require("slugify");
const { nanoid } = require("nanoid");

const toSlug = (text) => {
  if (!text) return "";
  return `${slugify(text, { lower: true, strict: true })}-${nanoid(6)}`;
};

module.exports = toSlug;
