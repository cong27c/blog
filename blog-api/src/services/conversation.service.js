// services/ConversationService.js
const {
  Conversation,
  UserConversation,
  User,
  Message,
  Sequelize,
} = require("@/models");

class ConversationService {
  // Lấy danh sách conversation của 1 user
  static async getUserConversations(userId) {
    // lấy tất cả conversation mà userId là thành viên
    const conversations = await Conversation.findAll({
      include: [
        {
          model: UserConversation,
          as: "members",
          include: [
            {
              model: User,
              as: "user",
              attributes: [
                "id",
                "user_name",
                "avatar",
                "first_name",
                "last_name",
              ],
            },
          ],
        },
        {
          model: Message,
          order: [["created_at", "DESC"]],
          as: "lastMessage",
        },
      ],
      order: [["last_message_at", "DESC"]],
    });

    // convert sang dạng FE cần
    return conversations.map((conv) => {
      const participants = conv.members
        .map((m) => m.user)
        .filter((u) => u.id !== userId);

      const participant = participants[0];
      return {
        id: conv.id,
        participant: participant
          ? {
              id: participant.id,
              name: `${participant.first_name} ${participant.last_name}`,
              username: participant.user_name,
              avatar: participant.avatar,
            }
          : null,
        lastMessage: conv.lastMessage
          ? {
              text: conv.lastMessage.content,
              timestamp: conv.lastMessage.created_at,
              senderId: conv.lastMessage.user_id,
            }
          : null,
        unreadCount: 0, // TODO: tính số tin chưa đọc từ bảng MessageRead/MessageStatus
        isOnline: false, // TODO: lấy từ Redis / Pusher presence channel
      };
    });
  }

  static async createConversation(userId) {
    try {
      const conversation = await Conversation.create({
        userId,
      });
      return conversation;
    } catch (error) {
      console.error("ConversationService Error:", error);
      throw error;
    }
  }
}

module.exports = ConversationService;
