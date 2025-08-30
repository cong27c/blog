import httpRequest from "@/utils/httpRequest";

export const sendMessage = async (data) => {
  try {
    const res = await httpRequest.post("/messages", data);
    return res.data;
  } catch (err) {
    console.error("sendMessage error:", err);
    throw err;
  }
};

export const getMessages = async (conversationId) => {
  try {
    const res = await httpRequest.get(`/messages/${conversationId}`);
    return res.data;
  } catch (err) {
    console.error("getMessages error:", err);
    throw err;
  }
};

export const getOrCreateConversation = async ({ recipientId }) => {
  try {
    const res = await httpRequest.post(`/messages/conversation`, {
      recipientId,
    });
    return res.data;
  } catch (err) {
    console.error("getMessages error:", err);
    throw err;
  }
};

export const markAsReadApi = async (conversationId, messageId) => {
  try {
    const res = await httpRequest.post(`/messages/${conversationId}/read`, {
      messageId,
    });
    return res.data;
  } catch (err) {
    console.error("markAsRead error:", err);
    throw err;
  }
};
