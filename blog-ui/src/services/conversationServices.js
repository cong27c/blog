import httpRequest from "@/utils/httpRequest";

export const getUserConversations = async () => {
  const res = await httpRequest.get(`/conversations`);
  return res.data;
};
