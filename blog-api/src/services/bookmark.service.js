const { Bookmark, Post, UserSetting, User } = require("@/models/index");
const { where, Op } = require("sequelize");

class BookmarksService {
  async toggleBookmark(userId, postId) {
    const existing = await Bookmark.findOne({
      where: { user_id: userId, post_id: postId },
    });

    if (existing) {
      await existing.destroy();
      return { bookmarked: false };
    } else {
      await Bookmark.create({ user_id: userId, post_id: postId });
      return { bookmarked: true };
    }
  }
  async getBookmarkedPosts(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { count, rows } = await Post.findAndCountAll({
      where: {
        status: "published",
        visibility: "public", // 👈 thêm điều kiện lọc visibility
      },
      limit,
      offset,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Bookmark,
          where: { user_id: userId },
          attributes: [],
        },
        {
          model: User,
          as: "author", // Phải đúng alias đã khai báo
          attributes: ["id", "email", "avatar", ["user_name", "username"]],
          include: [
            {
              model: UserSetting,
              as: "settings", // alias đã khai báo trong association
              attributes: [
                "allow_comments",
                "show_view_counts",
                "require_comment_approval",
                "default_post_visibility",
                "push_notifications",
                "email_new_comments",
                "email_new_likes",
                "email_new_followers",
                "email_weekly_digest",
                "profile_visibility",
                "allow_direct_messages",
                "search_engine_indexing",
                "show_email",
              ],
            },
          ],
        },
      ],
    });

    return {
      data: rows,
      total: count,
    };
  }

  async clearAllBookmarks(userId) {
    await Bookmark.destroy({
      where: { user_id: userId },
    });
  }
}

module.exports = new BookmarksService();
