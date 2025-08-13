const { Post, User, Topic, Sequelize, Comment } = require("@/models/index");
const estimateReadTime = require("@/utils/estimateReadTime");
const { where, Op } = require("sequelize");

class BlogsService {
  async getBySlug(slug) {
    try {
      const post = await Post.findOne({
        where: { slug, status: "published" },
        include: [
          {
            model: User,
            as: "author",
            attributes: [
              "id",
              "user_name",
              "title",
              "about",
              "avatar",
              "twitter_url",
              "github_url",
              "linkedin_url",
              "website_url",
              "followers_count",
              "following_count",
            ],
          },
          {
            model: Topic,
            as: "topics",
            attributes: ["name"],
            through: { attributes: [] },
          },
        ],
      });

      if (!post) return null;

      const postsCount = await Post.count({
        where: { user_id: post.author.id },
      });

      const author = post.author.toJSON();
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        featuredImage: post.featuredImage,
        publishedAt: post.published_at,
        updatedAt: post.updatedAt,
        slug: post.slug,
        readTime: estimateReadTime(post.content),
        topics: post.topics.map((t) => t.name),
        topic: post.topic,
        views: post.views_count,
        tags: post.topics.map((t) => t.name),
        author: {
          name: author.user_name,
          title: author.title,
          about: author.about,
          avatar: author.avatar,
          postsCount,
          followers: author.followers_count,
          following: author.following_count,
          social: {
            twitter: author.twitter_url,
            github: author.github_url,
            linkedin: author.linkedin_url,
            website: author.website_url,
          },
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  async incrementView(postId) {
    const post = await Post.findByPk(postId);
    if (!post) throw new Error("Post not found");

    post.views_count += 1;
    await post.save();
    return post.views_count;
  }

  async getRelatedPostsByTopic(topics = [], excludePostId, limit = 3) {
    try {
      return await Post.findAll({
        where: {
          id: { [Op.ne]: excludePostId },
          status: "published",
        },
        include: [
          {
            model: Topic,
            as: "topics",
            attributes: ["id", "name", "slug"],
            through: { attributes: [] },
            required: true, // cần thiết để join hiệu quả
          },
          {
            model: User,
            as: "author",
            attributes: ["id", ["user_name", "name"], "avatar"],
          },
        ],
        // Lọc post theo topic ở tầng ngoài dùng having hoặc subquery
        // Cách này: lọc bài post có ÍT NHẤT 1 topic trong danh sách
        having: Sequelize.where(
          Sequelize.literal(`EXISTS (
        SELECT 1 FROM PostTopics pt
        INNER JOIN Topics t ON pt.topic_id = t.id
        WHERE pt.post_id = Post.id
        AND t.name IN (${topics.map(() => "?").join(",")})
      )`),
          true
        ),
        replacements: topics, // giá trị cho `?` bên trên
        order: [["published_at", "DESC"]],
        limit,
        subQuery: false,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new BlogsService();
