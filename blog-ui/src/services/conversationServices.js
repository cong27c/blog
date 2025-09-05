import httpRequest from "@/utils/httpRequest";

export const getUserConversations = async () => {
  const res = await httpRequest.get(`/conversations`);
  return res.data;
};

export const createConversation = async () => {
  const res = await httpRequest.post(`/conversations`);
  return res.data;
};

export const chatMessage = async (convId, content) => {
  const res = await httpRequest.post(`/conversations/${convId}/chat`, {
    content,
  });
  return res.data;
};
