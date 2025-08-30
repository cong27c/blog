const { Like, Post, Sequelize, User } = require("@/models/index");
const { where, Op } = require("sequelize");
const { createNotification } = require("./notification.service");
const pusher = require("@/config/pusher");

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
    const like = await Like.create({
      user_id: userId,
      likable_type: likableType,
      likable_id: likableId,
    });

    return like;
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

      let ownerId = null;
      let link = "";

      if (likableType === "Post") {
        const post = await Post.findOne({ where: { id: likableId } });
        if (post) {
          ownerId = post.user_id;
          link = `/blog/${post.slug}`;
        }
      }

      // Lấy người like
      const liker = await User.findOne({ where: { id: userId } });

      const notification = await createNotification({
        userId: ownerId, // người nhận thông báo
        type: "like",
        title: `${liker.user_name} đã thích bài viết của bạn`,
        link,
        notifiableType: likableType, // "Post"
        notifiableId: likableId, // id của post
        read: false,
      });
      await pusher.trigger(
        `private-notifications-${ownerId}`,
        "new-notification",
        {
          notification,
        }
      );

      return { liked: true };
    }
  }
}
module.exports = new LikesService();
