const bookmarkService = require("@/services/bookmark.service");
const response = require("@/utils/response");

const getUserBookmarks = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const result = await bookmarkService.getBookmarkedPosts(
      userId,
      page,
      limit
    );
    response.success(res, 200, result);
  } catch (error) {
    console.log(error);
    response.error(res, 500, error.message);
  }
};

const toggleBookmark = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;

  try {
    const result = await bookmarkService.toggleBookmark(userId, postId);
    response.success(res, 200, result);
  } catch (err) {
    response.error(res, 500, err.message);
  }
};

const clearAllBookmarks = async (req, res) => {
  try {
    const userId = req.user.id;
    await bookmarkService.clearAllBookmarks(userId);
    response.success(res, 200);
  } catch (error) {
    console.error("Clear bookmarks failed:", error);
    response.error(res, 500, err.message);
  }
};

module.exports = {
  toggleBookmark,
  getUserBookmarks,
  clearAllBookmarks,
};
