require("dotenv").config();
const { Agent } = require("@/models");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

async function selectAgentForInput(inputText) {
  try {
    const agents = await Agent.findAll({ where: { isActive: true } });
    if (!agents.length) return null;

    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      temperature: 0,
      apiKey: process.env.GEMINI_API_KEY,
    });

    // Build systemPrompt rõ ràng hơn từ dữ liệu DB
    const agentDefinitions = agents
      .map((a) => {
        const agentData = a.toJSON();
        return `
Tên: ${agentData.name}
Mô tả: ${agentData.description || "Không có mô tả"}
Hướng dẫn: ${String(agentData.systemPrompt || "").trim()}
---`;
      })
      .join("\n");
    console.log(agentDefinitions);

    const systemPrompt = `
Bạn là bộ phân loại intent cho hệ thống blog.
Dựa trên tin nhắn của người dùng, hãy chọn **DUY NHẤT một agent** phù hợp nhất.

Danh sách agents khả dụng:
${agentDefinitions}

Nguyên tắc:
1. Chỉ trả về đúng tên agent (ví dụ: "SearchAgent", "ContentAgent", "InfoAgent", "SupportAgent").
2. Không giải thích, không thêm câu chữ khác.
3. Ưu tiên chọn agent có priority cao hơn nếu nhiều agent đều khớp.
4. Nếu không chắc chắn, chọn agent phù hợp nhất theo ngữ cảnh.

Ví dụ:
- "Tìm bài viết về Node.js" → SearchAgent
- "Làm sao để đăng ký tài khoản?" → SupportAgent
- "Tạo một bài viết mới về Docker" → ContentAgent
- "Hướng dẫn cách dùng hệ thống" → InfoAgent
`;

    const response = await llm.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: inputText },
    ]);

    const predictedAgentName = response.content.trim();

    // tìm trong DB
    const selectedAgent = agents.find(
      (a) => a.name.toLowerCase() === predictedAgentName.toLowerCase()
    );
    return (
      selectedAgent ||
      agents.sort((a, b) => (b.priority || 0) - (a.priority || 0))[0]
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = { selectAgentForInput };
