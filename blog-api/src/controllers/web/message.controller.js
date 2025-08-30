const MessageService = require("@/services/message.service");
const pusher = require("@/config/pusher");
const response = require("@/utils/response");

class MessageController {
  static async getOrCreateConversation(req, res) {
    try {
      const { recipientId } = req.body;
      const userId = req.user.id;

      if (!recipientId) {
        return res.status(400).json({ error: "recipientId is required" });
      }

      if (recipientId === userId) {
        return res.status(400).json({ error: "You cannot chat with yourself" });
      }
      const conversation = await MessageService.getOrCreateConversation({
        userId,
        recipientId,
      });

      response.success(res, 200, conversation.id);
    } catch (error) {
      console.error(error);
      response.error(res, 500, error.message);
    }
  }

  // 2. Lấy tất cả tin nhắn trong conversation
  static async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const currentUserId = req.user.id;

      const messages = await MessageService.findAllMessages({
        conversationId,
        currentUserId,
      });

      response.success(res, 200, messages);
    } catch (error) {
      console.error(error);
      response.error(res, 500, error.message);
    }
  }

  static async createMessage(req, res) {
    try {
      const userId = req.user.id;
      const { recipientId, conversationId, content } = req.body;

      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      let convId = conversationId;

      // Nếu chưa có conversationId thì tạo/get bằng recipientId
      if (!convId) {
        if (!recipientId) {
          return res.status(400).json({
            message: "Either conversationId or recipientId is required",
          });
        }

        if (recipientId === userId) {
          return res.status(400).json({ error: "You cannot message yourself" });
        }

        const conversation = await MessageService.getOrCreateConversation({
          userId,
          recipientId,
        });
        convId = conversation.id;
      }

      const message = await MessageService.createMessage({
        userId,
        conversationId: convId,
        content,
      });

      await pusher.trigger(`conversation-${convId}`, "new-message", {
        message,
        senderId: userId,
      });

      response.success(res, 201, message);
    } catch (error) {
      console.error(error);
      response.error(res, 500, error.message);
    }
  }

  static async markAsRead(req, res) {
    try {
      const { conversationId } = req.params;
      const { messageId } = req.body;
      const userId = req.user.id;

      await MessageService.markAsRead({ userId, conversationId, messageId });
      response.success(res, 200);
    } catch (error) {
      console.error(error);
      response.error(res, 500, error.message);
    }
  }
}

module.exports = MessageController;
