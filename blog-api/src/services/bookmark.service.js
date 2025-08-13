const { Bookmark, Post } = require("@/models/index");
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
      where: { status: "published" },
      limit,
      offset,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Bookmark,
          where: { user_id: userId },
          attributes: [],
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
