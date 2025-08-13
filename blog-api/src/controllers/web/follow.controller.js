const followService = require("@/services/follow.service");
const response = require("@/utils/response");

module.exports = {
  async follow(req, res) {
    try {
      const { followedId } = req.body;
      const followingId = req.user.id; // Lấy từ middleware auth

      const follow = await followService.followUser(followingId, followedId);

      return response.success(res, 200, follow);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async unfollow(req, res) {
    try {
      const { followedId } = req.body;
      const followingId = req.user.id;

      await followService.unfollowUser(followingId, followedId);
      return response.success(res, 201);
    } catch (error) {
      response.error(res, 500, error.message);
    }
  },

  async followers(req, res) {
    try {
      const { userId } = req.params;
      const followers = await followService.getFollowers(userId);
      return response.success(res, 200, followers);
    } catch (error) {
      response.error(res, 500, error.message);
    }
  },

  async following(req, res) {
    try {
      const { userId } = req.params;
      const following = await followService.getFollowing(userId);
      return response.success(res, 200, following);
    } catch (error) {
      response.error(res, 500, error.message);
    }
  },

  async checkFollowing(req, res) {
    try {
      const { followedId } = req.params;
      const followingId = req.user.id;

      const isFollow = await followService.isFollowing(followingId, followedId);
      res.json({ isFollowing: isFollow });
    } catch (error) {
      response.error(res, 500, error.message);
    }
  },
};
