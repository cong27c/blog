import httpRequest from "@/utils/httpRequest";

export const getProfile = async (username) => {
  const res = await httpRequest.get(`/profile/${username}`);
  return res.data;
};

export const getPostByUsername = async (username, page, limit) => {
  const res = await httpRequest.get(
    `/profile/user/${username}?page=${page}&limit=${limit}`
  );
  return res.data;
};

export const updateProfile = async (username, data) => {
  const res = await httpRequest.put(`/profile/${username}/edit`, data);
  return res.data;
};

export const followUser = async (followedId) => {
  const res = await httpRequest.post("/follow", { followedId });
  return res.data;
};

export const unfollowUser = async (followedId) => {
  const res = await httpRequest.post("/unfollow", { followedId });
  return res.data;
};

export const checkFollowing = async (followedId) => {
  const res = await httpRequest.get(`/is-following/${followedId}`);
  return res.data.isFollowing; // backend trả { isFollowing: true/false }
};
