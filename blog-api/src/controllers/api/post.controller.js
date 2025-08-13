const postsService = require("@/services/post.service");
const response = require("@/utils/response");
const throwError = require("@/utils/throwError");

const index = async (req, res) => {
  const { page, limit } = req;
  const { items, total } = await postsService.getAll(page, limit);
  res.paginate({ items, total });
};

const show = async (req, res) => {
  const post = await postsService.getByKey(req.params.key);
  if (!post) throwError(404, "Not Found.");

  response.success(res, 200, post);
};
const store = async (req, res) => {
  try {
    const userId = req.user?.id; // giả sử middleware auth gán vào req.user
    if (!userId) return response.error(res, 401, "Unauthorized");

    const {
      title,
      description,
      content,
      cover,
      topics = [],
      visibility,
      meta_title,
      meta_description,
      status,
      thumbnail,
      published_at,
    } = req.body;

    if (!title || !description || !content) {
      return response.error(
        res,
        400,
        "Title, description, and content are required"
      );
    }

    const postData = {
      title,
      description,
      content,
      cover,
      visibility: visibility || "public",
      meta_title,
      meta_description,
      user_id: userId,
      topics,
      status,
      thumbnail,
      published_at,
    };

    const post = await postsService.create(postData);
    return response.success(res, 201, post);
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeValidationError") {
      return response.error(
        res,
        400,
        error.errors.map((e) => e.message).join(", ")
      );
    }
    return response.error(res, 500, "Internal server error.");
  }
};

const update = async (req, res) => {
  const post = await postsService.update(req.params.key, req.body);

  if (!post) throwError(404, "Not Found.");

  response.success(res, 201, post);
};

const destroy = async (req, res) => {
  const result = await postsService.remove(req.params.key);

  if (!result) throwError(404, "Not Found.");

  response.success(res, 204);
};

module.exports = { show, index, store, update, destroy };
