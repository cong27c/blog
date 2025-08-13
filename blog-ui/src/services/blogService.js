import httpRequest from "@/utils/httpRequest";

export const getBlogPost = async (slug) => {
  const res = await httpRequest.get(`/blog/${slug}`);
  return res.data;
};

export const incrementView = async (postId) => {
  const res = await httpRequest.post(`/blog/posts/${postId}/view`);
  return res.data;
};

export const getRelatedPosts = async (topics, excludeId) => {
  const res = await httpRequest.get(`/blog/related/posts`, {
    params: { topics: JSON.stringify(topics), excludeId },
  });
  return res.data;
};

export const createComment = async (post_id, content) => {
  const res = await httpRequest.post("/comments", { post_id, content });
  return res.data;
};

export const replyToComment = async ({ parentId, postId, content }) => {
  const res = await httpRequest.post("/comments/reply", {
    parentId,
    content,
    postId,
  });
  return res.data;
};

export const updateComment = async (id, content) => {
  const res = await httpRequest.put(`/comments/${id}`, { content });
  return res.data;
};

export const deleteComment = async (id) => {
  const res = await httpRequest.del(`/comments/${id}`);
  return res.data;
};

export const toggleCommentLike = async (comment_id) => {
  const res = await httpRequest.post(`/comments/${comment_id}/like`);
  return res.data;
};

export const getCommentsByUser = async (user_id) => {
  const res = await httpRequest.get(`/comments/user/${user_id}`);
  return res.data;
};

export const getPostComments = async (slug, page = 1, limit = 10) => {
  const res = await httpRequest.get(`/comments/posts/${slug}`, {
    params: { page, limit },
  });
  return res.data;
};

export default {
  getBlogPost,
  getRelatedPosts,
  incrementView,
  createComment,
  updateComment,
  deleteComment,
  toggleCommentLike,
  getCommentsByUser,
  getPostComments,
};
