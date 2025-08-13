const postService = require("@/services/post.service");
const response = require("@/utils/response");

const getPostsByStatus = async (req, res) => {
  const status = req.query.status || "published"; // default: published
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    if (!["published", "draft"].includes(status)) {
      return response.error(
        res,
        400,
        "Invalid status. Only 'published' or 'draft' allowed."
      );
    }

    const result = await postService.getByStatus(status, page, limit);
    response.success(res, 200, result);
  } catch (err) {
    console.error("Error getting posts by status:", err);
    response.error(res, 500, "Internal server error.");
  }
};

const getPostsByCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { items: data } = await postService.getByUserId(userId, page, limit);
    response.success(res, 200, data);
  } catch (err) {
    console.error(err);
    response.error(res, 500, "Internal server error.");
  }
};

const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const { dataValues: result } = await postService.getAll(page, limit);
    response.success(res, 200, [result]);
  } catch (error) {
    console.log(error);
    response.error(res, 500, "Internal server error.");
  }
};

const getPostsByTopic = async (req, res) => {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await postService.getPostsByTopicSlug(slug, page, limit);

    if (!data) {
      return res.status(404).json({ message: "Topic not found" });
    }

    return res.json(data);
  } catch (error) {
    console.error("Error fetching posts by topic:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  getPostsByStatus,
  getAllPosts,
  getPostsByCurrentUser,
  getPostsByTopic,
};
