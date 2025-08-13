function estimateReadTime(text) {
  const plainText = text.replace(/<[^>]*>/g, ""); // loại bỏ HTML tag
  const words = plainText.trim().split(/\s+/).length;
  return Math.ceil(words / 200); // 200 words per minute
}

module.exports = estimateReadTime;
