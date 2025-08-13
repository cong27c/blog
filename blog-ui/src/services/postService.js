import httpRequest from "@/utils/httpRequest";

export const createPost = async (data) => {
  const res = await httpRequest.post("/api/v1/posts", data);
  return res.data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await httpRequest.post("/uploads", formData);
  return res.data;
};

export const getTopicBySlug = async (slug) => {
  const res = await httpRequest.get(`/topics/${slug}`);
  return res.data;
};
export const getPostByTopic = async (slug, page, limit) => {
  const res = await httpRequest.get(
    `/topics/${slug}/posts?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getPostBySlugTopic = async (slug, page, limit) => {
  const res = await httpRequest.get(
    `/posts/topic/${slug}?page=${page}&limit=${limit}`
  );
  return res.data;
};

export default {
  getTopicBySlug,
  createPost,
};
