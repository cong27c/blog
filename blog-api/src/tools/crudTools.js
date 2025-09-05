const { Post } = require("@/models");

const createPost = async (userId, data) => {
  const post = Post.create({ ...data, userId });
  console.log("POST", post);
  return post;
};

const updatePost = async (userId, id, data) => {
  const [updatedCount] = await Post.update(data, {
    where: { id, userId },
  });
  if (!updatedCount)
    throw new Error("Không có quyền sửa bài này hoặc bài không tồn tại");
  return updatedCount;
};

const deletePost = async (userId, id) => {
  const deletedCount = await Post.destroy({
    where: { id, userId },
  });
  if (!deletedCount)
    throw new Error("Không có quyền xóa bài này hoặc bài không tồn tại");
  return deletedCount;
};

module.exports = { createPost, updatePost, deletePost };
