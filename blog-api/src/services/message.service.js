const pusher = require("@/config/pusher");
const {
  Message,
  Conversation,
  UserConversation,
  User,
  Sequelize,
  sequelize,
} = require("@/models");
const { Op, fn, col, where } = require("sequelize");
const { createNotification } = require("./notification.service");

class MessageService {
  static async getOrCreateConversation({ userId, recipientId }) {
    if (!userId || !recipientId) {
      throw new Error("Missing userId or recipientId");
    }

    // 1. Tìm conversation private có chứa cả 2 user
    let conversation = await Conversation.findOne({
      where: { type: "direct" },
      include: [
        {
          model: UserConversation,
          as: "member1",
          where: { user_id: userId },
          required: true,
        },
        {
          model: UserConversation,
          as: "member2",
          where: { user_id: recipientId },
          required: true,
        },
      ],
    });

    // 2. Nếu có thì trả về
    if (conversation) {
      return conversation;
    }

    // 3. Nếu chưa có thì tạo mới
    conversation = await Conversation.create({ type: "private" });

    await UserConversation.bulkCreate([
      { conversation_id: conversation.id, user_id: userId },
      { conversation_id: conversation.id, user_id: recipientId },
    ]);

    // gắn members để khi return FE có thể dùng ngay
    conversation.members = [{ user_id: userId }, { user_id: recipientId }];

    return conversation;
  }
  // Tạo message
  static async createMessage({ userId, recipientId, conversationId, content }) {
    let conversation;

    if (conversationId) {
      conversation = await Conversation.findByPk(conversationId);
      if (!conversation) {
        throw new Error("Conversation not found");
      }
    } else {
      conversation = await this.getOrCreateConversation({
        userId,
        recipientId,
      });
    }

    const message = await Message.create({
      user_id: userId,
      conversation_id: conversation.id,
      content,
    });
    const participants = await UserConversation.findAll({
      where: { conversation_id: conversation.id },
      attributes: ["user_id"],
    });
    const participantIds = participants.map((p) => p.user_id);

    const rcId = participantIds.find((id) => id !== userId);

    const user = await User.findOne({ where: { id: userId } });
    const notification = await createNotification({
      userId: rcId,
      type: "message",
      link: "/messages",
      title: `${user.user_name} đã nhắn tin cho bạn`,
      notifiableType: "Message",
      notifiableId: message.id,
      read: false,
    });
    await pusher.trigger(`private-notifications-${rcId}`, "new-notification", {
      notification,
    });

    return {
      id: message.id,
      senderId: message.user_id,
      text: message.content,
      userId: message.user_id,
      timestamp: message.created_at.toISOString(),
    };
  }

  static async findAllMessages({ conversationId, currentUserId }) {
    try {
      const messages = await Message.findAll({
        where: { conversation_id: conversationId },
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "first_name", "last_name", "user_name"],
          },
        ],
        order: [["created_at", "ASC"]],
      });

      // format lại data cho FE
      return messages.map((msg) => ({
        id: msg.id,
        text: msg.content,
        sender: msg.user_id === currentUserId ? "me" : "other",
        senderId: msg.user_id,
        timestamp: msg.created_at.toISOString(),
      }));
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async isMemberOfConversation(conversationId, userId) {
    try {
      const member = await UserConversation.findOne({
        where: {
          conversation_id: conversationId,
          user_id: userId,
        },
      });
      return !!member;
    } catch (error) {
      console.error("isMemberOfConversation error:", error);
      throw new Error("Failed to check conversation membership");
    }
  }
  // Cập nhật last_read_message_id khi user đọc tinsenderId
  static async markAsRead({ userId, conversationId, messageId }) {
    return UserConversation.update(
      { last_read_message_id: messageId },
      { where: { user_id: userId, conversation_id: conversationId } }
    );
  }

  // Lấy danh sách message trong conversation
  static async getMessages(conversationId, limit = 50, offset = 0) {
    return Message.findAll({
      where: { conversation_id: conversationId },
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });
  }
}

module.exports = MessageService;
