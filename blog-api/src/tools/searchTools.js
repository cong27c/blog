const { Post } = require("@/models");
const { Op } = require("sequelize");

const searchPosts = async (input) => {
  const posts = await Post.findAll({
    where: { title: { [Op.like]: `%${input}%` } },
    limit: 5,
  });
  return posts.map((p) => ({ id: p.id, title: p.title }));
};

module.exports = { searchPosts };
