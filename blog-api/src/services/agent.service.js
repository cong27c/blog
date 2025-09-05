const { Conversation } = require("@/models");
const pusher = require("@/config/pusher");
const { selectAgentForInput } = require("@/utils/agentUtils");
const { createLLM, createExecutor } = require("@/utils/llmUtils");
const {
  saveUserMessage,
  saveAssistantMessage,
  buildPusherPayload,
} = require("@/utils/messageUtils");

exports.handleUserMessage = async ({ userId, conversationId, content }) => {
  try {
    // 1. Lưu message của user
    const userMessage = await saveUserMessage({
      userId,
      conversationId,
      content,
    });

    // 2. Chọn agent phù hợp với nội dung
    const selectedAgent = await selectAgentForInput(content);

    // 3. Cập nhật agent vào conversation nếu có
    if (selectedAgent) {
      await Conversation.update(
        { agent_id: selectedAgent.id, updated_at: new Date() },
        { where: { id: conversationId } }
      );
    }

    // 4. Tạo LLM và executor
    const llm = createLLM(selectedAgent);
    const executor = await createExecutor(llm, selectedAgent);

    // 5. Gọi executor để lấy phản hồi từ agent
    let assistantText = "";
    try {
      const result = await executor.invoke({ input: content });
      assistantText = result?.output || "Xin lỗi, không có kết quả.";
    } catch (err) {
      console.error("agent error:", err);
      assistantText = "Xin lỗi — hệ thống gặp lỗi khi xử lý.";
    }

    // 6. Lưu message từ bot
    const assistantMessage = await saveAssistantMessage({
      agent_id: selectedAgent?.id || null,
      conversationId,
      content: assistantText,
    });

    // 7. Đẩy message qua Pusher
    pusher.trigger(
      `conversation-${conversationId}`,
      "new-message",
      buildPusherPayload(assistantMessage)
    );

    return assistantMessage;
  } catch (error) {
    console.log(error);
  }
};
