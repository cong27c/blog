const commentService = require("@/services/comment.service");
const response = require("@/utils/response");

module.exports = {
  async create(req, res) {
    try {
      const { post_id, content } = req.body;
      const user_id = req.user.id; // lấy từ middleware auth
      const comment = await commentService.createComment({
        user_id,
        post_id,
        content,
      });
      return response.success(res, 200, comment);
    } catch (error) {
      response.error(res, 500, error.message);
    }
  },

  async replyToComment(req, res) {
    try {
      const { parentId, content, postId } = req.body;
      const userId = req.user.id; // giả sử bạn có middleware xác thực user và lưu user vào req.user

      if (!parentId || !content) {
        return res.status(400).json({ message: "Missing parentId or content" });
      }

      const newReply = await commentService.createReplyComment({
        parentId,
        userId,
        content,
        postId,
      });

      return response.success(res, 200, newReply);
    } catch (error) {
      console.error(error);
      response.error(res, 500, error.message);
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      const user_id = req.user.id;
      const comment = await commentService.updateComment(id, user_id, content);
      return response.success(res, 200, comment);
    } catch (error) {
      response.error(res, 500, error.message);
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      const data = await commentService.deleteComment(id, user_id);
      return response.success(res, 200, data);
    } catch (error) {
      response.error(res, 500, error.message);
    }
  },

  async toggleLike(req, res) {
    try {
      const { comment_id } = req.params;
      const user_id = req.user.id;
      const result = await commentService.toggleLike(comment_id, user_id);
      return response.success(res, 200, result);
    } catch (error) {
      response.error(res, 500, error.message);
    }
  },

  async getByUser(req, res) {
    try {
      const { user_id } = req.params;
      const comments = await commentService.getCommentsByUser(user_id);
      return response.success(res, 200, comments);
    } catch (error) {
      response.error(res, 500, error.message);
    }
  },

  async getCommentsByPost(req, res) {
    const slug = req.params.slug;
    const currentUserId = req.user?.id;
    const { page, limit } = req;
    try {
      const comments = await commentService.getPostComment(
        slug,
        page,
        limit,
        currentUserId
      );
      return response.success(res, 200, comments);
    } catch (error) {
      console.log(error);
      return response.error(res, 404, error);
    }
  },
};
