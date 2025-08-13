import httpRequest from "@/utils/httpRequest";

export const getFeaturedPosts = async () => {
  const res = await httpRequest.get("/posts/featured");
  return res.data;
};

export const getLatestPosts = async () => {
  const res = await httpRequest.get("/posts/latest");
  return res.data;
};

export const getPostLikes = async (postId) => {
  const res = await httpRequest.get(`/posts/${postId}/likes`);
  return res.data;
};

export const togglePostLike = async (postId) => {
  const res = await httpRequest.post(`/posts/${postId}/likes`);
  return res.data;
};

export const getUserBookmarks = async () => {
  const res = await httpRequest.get(`/me/bookmarks`);
  return res.data;
};

export const togglePostBookmarks = async (postId) => {
  const res = await httpRequest.post(`/posts/${postId}/bookmarks`);
  return res.data;
};

export const getTrendingTopics = async () => {
  const res = await httpRequest.get(`/trending-topics`);
  return res.data;
};

export const getAllTopics = async (page, limit) => {
  const res = await httpRequest.get(`/topics?page=${page}&limit=${limit}`);
  return res.data;
};

export const getMyPosts = async (page, limit) => {
  const res = await httpRequest.get(`/my-posts?page=${page}&limit=${limit}`);
  return res.data;
};

export const getMyPostsByStatus = async (status, page, limit) => {
  const res = await httpRequest.get(
    `/status?status=${status}&page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getMyPostBookmarked = async (page, limit) => {
  const res = await httpRequest.get(
    `/me/bookmarks?page=${page}&limit=${limit}`
  );
  console.log(res);
  return res.data;
};

export const clearAllBookmarks = async () => {
  const res = await httpRequest.del(`/bookmarks/clear`);
  return res.data;
};
