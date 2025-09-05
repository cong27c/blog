// controllers/ConversationController.js
const ConversationService = require("@/services/conversation.service");
const agentService = require("@/services/agent.service");
const response = require("@/utils/response");

class ConversationController {
  static async getUserConversations(req, res) {
    try {
      const userId = req.user.id;
      const conversations = await ConversationService.getUserConversations(
        userId
      );
      return res.json(conversations);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async chatMessage(req, res) {
    try {
      console.log("hello");
      const userId = req.user.id;
      const conversationId = parseInt(req.params.conversationId, 10);
      const { content } = req.body;

      if (!userId || !conversationId || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // gọi service chính (langchain + db + pusher)
      const assistantMessage = await agentService.handleUserMessage({
        userId,
        conversationId,
        content,
      });

      return res.status(200).json({ success: true, message: assistantMessage });
    } catch (err) {
      console.error("createMessage error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async createConversation(req, res) {
    try {
      const userId = req.user.id;

      if (!userId) {
        return res
          .status(400)
          .json({ success: false, error: " userId là bắt buộc" });
      }

      const conversation = await ConversationService.createConversation(userId);
      return response.success(res, 201, conversation);
    } catch (error) {
      response.error(res, 500, error.message);
      console.error("ConversationController Error:", error);
    }
  }
}

module.exports = ConversationController;
