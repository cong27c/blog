const { Post, Follow } = require("../models");

async function canViewPost(req, res, next) {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const viewerId = req.user.id; // req.user thường có nhờ JWT auth middleware
    const ownerId = post.user_id;

    if (post.visibility === "public") return next();

    if (post.visibility === "followers") {
      const follow = await Follow.findOne({
        where: { follower_id: viewerId, following_id: ownerId },
      });
      if (follow) return next();
    }

    if (post.visibility === "private" && viewerId === ownerId) {
      return next();
    }

    return res.status(403).json({ message: "Not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = canViewPost;
