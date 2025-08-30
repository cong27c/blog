const { Comment, User, Like, Post, UserSetting } = require("@/models/index");
const { createNotification } = require("./notification.service");
const { where } = require("sequelize");
const pusher = require("@/config/pusher");
module.exports = {
  async getPostComment(slug, page, limit, currentUserId) {
    const post = await Post.findOne({ where: { slug } });
    if (!post) throw new Error("Post not found");

    // Lấy toàn bộ comment của post, kèm author luôn
    const allComments = await Comment.findAll({
      where: { post_id: post.id },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "avatar", ["user_name", "username"]],
        },
      ],
      order: [["created_at", "ASC"]],
    });

    const commentIds = allComments.map((c) => c.id);
    let likedSet = new Set();

    if (currentUserId && commentIds.length > 0) {
      const liked = await Like.findAll({
        where: {
          user_id: currentUserId,
          likable_id: commentIds,
          likable_type: "comment",
        },
      });
      likedSet = new Set(liked.map((l) => l.likable_id));
    }

    // Hàm build cây comment đa cấp
    function buildCommentTree(comments, parentId = null) {
      return comments
        .filter((c) => c.parent_id === parentId)
        .map((c) => {
          const children = buildCommentTree(comments, c.id);
          return {
            ...c.toJSON(),
            isLiked: likedSet.has(c.id),
            isEdited:
              new Date(c.updated_at).getTime() -
                new Date(c.created_at).getTime() >
              1000,
            replies: children,
          };
        });
    }

    const tree = buildCommentTree(allComments);

    return {
      comments: tree,
    };
  },

  async createComment({ user_id, post_id, content }) {
    try {
      // Tạo comment mới

      const comment = await Comment.create({ user_id, post_id, content });

      // Lấy comment vừa tạo kèm user (author)
      const fullComment = await Comment.findOne({
        where: { id: comment.id },
        include: [
          {
            model: User,
            as: "author",
            attributes: ["user_name", "avatar"],
          },
        ],
        raw: false,
      });

      // Đếm số like của comment
      const likesCount = await Like.count({
        where: {
          likable_type: "comment",
          likable_id: comment.id,
        },
      });

      // Kiểm tra xem user hiện tại đã like comment này chưa
      const isLiked = (await Like.findOne({
        where: {
          user_id: user_id,
          likable_type: "comment",
          likable_id: comment.id,
        },
      }))
        ? true
        : false;
      const post = await Post.findOne({ where: { id: post_id } });
      let notification = null;
      if (post.user_id !== user_id) {
        const userSetting = await UserSetting.findOne({
          where: { user_id: post.user_id },
        });

        if (!userSetting || userSetting.email_new_comments === true) {
          notification = await createNotification({
            userId: post.user_id,
            type: "comment",
            title: `${fullComment.author.user_name} đã bình luận bài viết của bạn`,
            link: `/blog/${post.slug}`,
            notifiableType: "Comment",
            notifiableId: fullComment.id,
            read: false,
          });

          // Push realtime bằng Pusher
          await pusher.trigger(
            `private-notifications-${post.user_id}`,
            "new-notification",
            { notification }
          );
        }
      }

      await pusher.trigger(
        `private-notifications-${post.user_id}`,
        "new-notification",
        {
          notification,
        }
      );

      return {
        id: fullComment.id,
        author: {
          username: fullComment.author.user_name,
          avatar: fullComment.author.avatar,
        },
        content: fullComment.content,
        createdAt: fullComment.created_at.toISOString(),
        likes: likesCount,
        isLiked,
        replies: [], // bạn có thể query thêm replies nếu cần
      };
    } catch (error) {
      console.log(error);
    }
  },

  async createReplyComment({ parentId, userId, postId, content }) {
    // Tạo reply mới
    const newReply = await Comment.create({
      user_id: userId,
      post_id: postId, // hoặc lấy post_id từ comment cha nếu có
      content,
      parent_id: parentId,
    });

    // Lấy thông tin author
    const author = await User.findByPk(userId, {
      attributes: ["user_name", "avatar"],
    });

    // Đếm số likes trên reply comment
    const likesCount = await Like.count({
      where: {
        likable_type: "comment",
        likable_id: newReply.id,
      },
    });

    // Kiểm tra user đã like reply comment này chưa
    const isLiked = (await Like.findOne({
      where: {
        user_id: userId,
        likable_type: "comment",
        likable_id: newReply.id,
      },
    }))
      ? true
      : false;

    return {
      id: newReply.id,
      author: {
        username: author.user_name,
        avatar: author.avatar,
      },
      content: newReply.content,
      createdAt: newReply.created_at,
      likes: likesCount,
      isLiked,
      replies: [],
    };
  },

  async updateComment(id, user_id, content) {
    try {
      const comment = await Comment.findOne({ where: { id, user_id } });
      if (!comment) throw new Error("Comment not found or not authorized");
      comment.content = content;
      await comment.save();
      return comment;
    } catch (error) {
      console.log(error);
    }
  },

  async deleteComment(id, user_id) {
    try {
      const deleted = await Comment.destroy({ where: { id, user_id } });
      if (!deleted) throw new Error("Comment not found or not authorized");
      return true;
    } catch (error) {
      console.log(error);
    }
  },

  async toggleLike(comment_id, user_id) {
    try {
      const existingLike = await Like.findOne({
        where: {
          user_id,
          likable_type: "comment",
          likable_id: comment_id,
        },
      });

      if (existingLike) {
        await existingLike.destroy();
        // Đếm lại số like
        const likeCount = await Like.count({
          where: {
            likable_type: "comment",
            likable_id: comment_id,
          },
        });
        return { liked: false, likeCount };
      } else {
        await Like.create({
          user_id,
          likable_type: "comment",
          likable_id: comment_id,
        });
        const likeCount = await Like.count({
          where: {
            likable_type: "comment",
            likable_id: comment_id,
          },
        });
        return { liked: true, likeCount };
      }
    } catch (error) {
      console.log(error);
      throw error; // có thể ném ra hoặc xử lý theo logic riêng
    }
  },

  async getCommentsByUser(user_id) {
    try {
      return await Comment.findAll({
        where: { user_id },
        include: [
          {
            model: User,
            as: "author",
            attributes: ["id", "username", "avatar"],
          },
        ],
        order: [["created_at", "DESC"]],
      });
    } catch (error) {
      console.log(error);
    }
  },
};
