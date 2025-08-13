const profileService = require("@/services/profile.service");
const response = require("@/utils/response");

const getProfile = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const username = req.params.username;
    const profile = await profileService.getProfile(username, currentUserId);
    response.success(res, 200, profile);
  } catch (error) {
    console.error("Error getting profile:", error);
    response.error(res, 500, error.message);
  }
};
const getPostsByCurrentUser = async (req, res) => {
  try {
    const username = req.params.username;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await profileService.getByUsername(username, page, limit);
    response.success(res, 200, data);
  } catch (err) {
    console.error(err);
    response.error(res, 500, "Internal server error.");
  }
};

const updateProfile = async (req, res) => {
  const { username } = req.params;
  const data = req.body;
  console.log("hello");

  try {
    const updatedProfile = await profileService.updateProfile(username, data);

    response.success(res, 200, updatedProfile);
  } catch (error) {
    console.log(error);
    response.error(res, 500, "Internal server error.");
  }
};

module.exports = {
  getPostsByCurrentUser,
  getProfile,
  updateProfile,
};
