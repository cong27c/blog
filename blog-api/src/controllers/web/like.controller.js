const { toggleLike, getLikesInfo } = require("@/services/like.service");
const response = require("@/utils/response");

const togglePostLike = async (req, res) => {
  const userId = req.user?.id; // middleware auth lấy từ token
  const likableId = req.params.id;
  const likableType = "Post";
  if (!likableId) {
    return response.error(res, 400, "Post ID is missing");
  }

  try {
    const liked = await toggleLike({ userId, likableType, likableId });
    response.success(res, 200, liked);
  } catch (error) {
    console.error(error);
    response.error(res, 500, error.message);
  }
};

const getPostLikes = async (req, res) => {
  const userId = req.user?.id;
  const likableId = req.params.id;

  const likableType = "Post";
  if (!likableId) {
    return response.error(res, 400, "Post ID is missing");
  }
  try {
    const liked = await getLikesInfo({ userId, likableType, likableId });

    response.success(res, 200, liked);
  } catch (error) {
    console.error(error);
    response.error(res, 500, error.message);
  }
};

module.exports = {
  togglePostLike,
  getPostLikes,
};
