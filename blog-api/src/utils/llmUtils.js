require("dotenv").config();
const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

function createLLM(selectedAgent) {
  return new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY, // key từ Google AI Studio
    model: selectedAgent?.model || "gemini-1.5-flash", // model miễn phí
    temperature: 0,
  });
}
async function createExecutor(llm, selectedAgent) {
  // Nếu không có agent config, throw hoặc return null (caller sẽ fallback)
  if (!selectedAgent) {
    return null;
  }

  // Chọn agentType phù hợp; "zero-shot-react-description" là thường dùng cho tool-calling agent
  const agentType = "zero-shot-react-description";

  // initializeAgentExecutorWithOptions builds the proper Agent + Executor for you.
  const executor = await initializeAgentExecutorWithOptions([], llm, {
    agentType,
    verbose: true,
    agentArgs: {
      prefix:
        selectedAgent?.systemPrompt ||
        `
Bạn là một trợ lý hội thoại.
Nhiệm vụ của bạn là trả lời tự nhiên, hữu ích và ngắn gọn.
Không có tool nào khả dụng, hãy chỉ dựa vào kiến thức của bạn để phản hồi.
    `,
    },
  });

  return executor;
}

module.exports = { createLLM, createExecutor };
