const { DynamicTool } = require("langchain/tools");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

// Tạo LLM
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY, // key từ Google AI Studio
  model: "gemini-1.5-flash", // model miễn phí
  temperature: 0,
});

function buildFAQTool() {
  return new DynamicTool({
    name: "faq",
    description: "Trả lời câu hỏi dựa trên FAQ + LLM nếu không tìm thấy",
    func: async (question) => {
      // 1️⃣ Tìm trong DB FAQ
      const faqResults = await getFAQ(question);

      if (faqResults.length > 0) {
        return faqResults.map((f) => `${f.question} → ${f.answer}`).join("\n");
      }

      // 2️⃣ Nếu không tìm thấy → gọi LLM
      const response = await llm.call([
        {
          role: "system",
          content: `
Bạn là **InfoAgent** – một trợ lý ảo thân thiện và dễ gần, chuyên giúp người dùng hiểu cách sử dụng hệ thống blog.
- Trả lời các câu hỏi về cách tạo, sửa, xóa, tìm kiếm bài viết, hoặc các tính năng của blog.
- Giải thích chi tiết, dễ hiểu, dùng ngôn ngữ gần gũi, tránh thuật ngữ phức tạp.
- Nếu không chắc chắn câu trả lời, hướng dẫn người dùng cách tự kiểm tra hoặc tìm thêm thông tin.
- Luôn khuyến khích tương tác và giữ giọng điệu thân thiện, tích cực.
`,
        },
        {
          role: "user",
          content: question,
        },
      ]);

      return response.text || "Xin lỗi, mình không trả lời được câu hỏi này.";
    },
  });
}

module.exports = { buildFAQTool };
