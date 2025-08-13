const topicService = require("@/services/topic.service");
const response = require("@/utils/response");

const getTrendingTopics = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const topics = await topicService.getTrendingTopic(limit);
    response.success(res, 200, topics);
  } catch (error) {
    console.error("Error getting trending topics:", error);
    response.error(res, 500, error.message);
  }
};

const getAllTopics = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  try {
    const topics = await topicService.getAll(page, limit);
    response.success(res, 200, topics);
  } catch (error) {
    console.error("Error getting  topics:", error);
    response.error(res, 500, error.message);
  }
};

async function getTopicDetail(req, res) {
  try {
    const { slug } = req.params;

    const topic = await topicService.getTopicBySlug(slug);

    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    response.success(res, 200, topic);
  } catch (err) {
    console.error(err);
    response.error(res, 500, err.message);
  }
}

async function getTopicDetailWithPosts(req, res) {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await topicService.getPostsByTopicSlug(slug, page, limit);

    if (!data) {
      return res.status(404).json({ message: "Topic not found" });
    }

    response.success(res, 200, data);
  } catch (err) {
    console.error(err);
    response.error(res, 500, err.message);
  }
}

module.exports = {
  getTrendingTopics,
  getAllTopics,
  getTopicDetail,
  getTopicDetailWithPosts,
};
