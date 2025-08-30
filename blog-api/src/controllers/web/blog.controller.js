const blogService = require("@/services/blog.service");
const response = require("@/utils/response");
const throwError = require("@/utils/throwError");

exports.getBlogDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await blogService.getBySlug(slug);

    if (!blog) throwError(404, "Blog not Found.");

    return response.success(res, 201, blog);
  } catch (err) {
    console.log(err);
    return response.error(res, 500, "Internal server error.");
  }
};

exports.getRelatedPosts = async (req, res) => {
  try {
    const { topics, excludeId } = req.query;
    const topicsArray = JSON.parse(topics);

    if (!topicsArray || !excludeId) {
      throwError(400, "Missing topics or excludeId");
    }

    const relatedPosts = await blogService.getRelatedPostsByTopic(
      topicsArray,
      Number(excludeId)
    );

    return response.success(res, 201, relatedPosts);
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return response.error(res, 500, "Internal server error.");
  }
};

exports.incrementView = async (req, res) => {
  const postId = req.params.id;

  if (!postId || isNaN(postId)) {
    return res.status(400).json({ message: "Invalid post ID" });
  }

  try {
    const views = await blogService.incrementView(postId);
    return res.status(200).json({ message: "View incremented", views });
  } catch (err) {
    console.error("Error incrementing view:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
