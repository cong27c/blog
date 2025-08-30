// controllers/ConversationController.js
const ConversationService = require("@/services/conversation.service");

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
}

module.exports = ConversationController;
