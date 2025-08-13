const { getFeaturePosts, getLatestPosts } = require("@/services/post.service");
const response = require("@/utils/response");

const getFeaturedPostsController = async (req, res) => {
  try {
    const data = await getFeaturePosts();
    response.success(res, 200, data);
  } catch (error) {
    console.log(error);
    response.error(res, 500, error.message);
  }
};
const getLatestPostsController = async (req, res) => {
  try {
    const data = await getLatestPosts();
    response.success(res, 200, data);
  } catch (error) {
    console.log(error);
    response.error(res, 500, error.message);
  }
};

module.exports = {
  getFeaturedPostsController,
  getLatestPostsController,
};
