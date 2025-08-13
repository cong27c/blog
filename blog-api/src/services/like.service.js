const { Like, Post, Sequelize } = require("@/models/index");
const { where, Op } = require("sequelize");

class LikesService {
  async getLikesInfo({ userId, likableType, likableId }) {
    const [likedObj, post] = await Promise.all([
      userId
        ? Like.findOne({
            where: {
              user_id: userId,
              likable_type: likableType,
              likable_id: likableId,
            },
          })
        : null,
      likableType === "Post"
        ? Post.findByPk(likableId, { attributes: ["likes_count"] })
        : null,
    ]);

    return {
      count: post?.likes_count || 0,
      liked: !!likedObj,
    };
  }

  async createLike(userId, likableType, likableId) {
    return await Like.create({
      user_id: userId,
      likable_type: likableType,
      likable_id: likableId,
    });
  }

  async removeLike(userId, likableType, likableId) {
    return await Like.destroy({
      where: {
        user_id: userId,
        likable_type: likableType,
        likable_id: likableId,
      },
    });
  }

  async toggleLike({ userId, likableType, likableId }) {
    // Kiểm tra đã like chưa
    const existingLike = await Like.findOne({
      where: {
        user_id: userId,
        likable_type: likableType,
        likable_id: likableId,
      },
    });

    if (existingLike) {
      // ❌ Unlike
      await existingLike.destroy();

      // Giảm like_count nhưng không cho xuống < 0
      await Post.update(
        { likes_count: Sequelize.literal("GREATEST(likes_count - 1, 0)") },
        { where: { id: likableId } }
      );

      return { liked: false };
    } else {
      // ✅ Like
      await Like.create({
        user_id: userId,
        likable_type: likableType,
        likable_id: likableId,
      });

      await Post.increment("likes_count", { by: 1, where: { id: likableId } });

      return { liked: true };
    }
  }
}
module.exports = new LikesService();
