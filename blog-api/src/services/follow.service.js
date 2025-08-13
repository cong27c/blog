const { Follow } = require("@/models");

module.exports = {
  async followUser(followingId, followedId) {
    // Kiểm tra đã follow chưa
    const exists = await Follow.findOne({
      where: { following_id: followingId, followed_id: followedId },
    });
    if (exists) throw new Error("Already followed");

    return await Follow.create({
      following_id: followingId,
      followed_id: followedId,
    });
  },

  async unfollowUser(followingId, followedId) {
    const deleted = await Follow.destroy({
      where: { following_id: followingId, followed_id: followedId },
    });
    if (!deleted) throw new Error("Follow not found");
    return true;
  },

  async getFollowers(userId) {
    return await Follow.findAll({
      where: { followed_id: userId },
    });
  },

  async getFollowing(userId) {
    return await Follow.findAll({
      where: { following_id: userId },
    });
  },

  async isFollowing(followingId, followedId) {
    const follow = await Follow.findOne({
      where: { following_id: followingId, followed_id: followedId },
    });
    return !!follow;
  },
};
