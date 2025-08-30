const {
  Post,
  Topic,
  Comment,
  User,
  sequelize,
  UserSetting,
  Follow,
} = require("@/models/index");
const { nanoid } = require("nanoid");
const { where, Op } = require("sequelize");
const { default: slugify } = require("slugify");
const { Sequelize } = require("sequelize");
const toSlug = require("@/utils/slug");
const scheduleJob = require("@/utils/scheduler");
const scheduleOnce = require("@/utils/scheduleOnce");

class PostsService {
  async getAll(page, limit) {
    const offset = (page - 1) * limit;

    const { rows: items, count: total } = await Post.findAndCountAll({
      include: [
        {
          model: Topic,
          as: "topics",
          attributes: ["id", "name"],
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    return { items, total };
  }

  async getByUserId(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { rows: items, count: total } = await Post.findAndCountAll({
      where: { user_id: userId },
      limit,
      offset,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Topic,
          as: "topics",
          attributes: ["id", "name", "slug"],
        },
        {
          model: User,
          as: "author",
          attributes: ["id", "email"],
        },
      ],
    });

    return { items, total };
  }

  async getFeaturePosts(userId) {
    // Lấy danh sách user mà mình follow
    const follows = await Follow.findAll({
      where: { following_id: userId },
      attributes: ["followed_id"],
    });
    const followingIds = follows.map((f) => f.followed_id);

    const featuredPosts = await Post.findAll({
      where: {
        status: "published",
        [Op.or]: [
          { visibility: "public" },
          { visibility: "private", user_id: userId },
          { visibility: "followers", user_id: followingIds },
        ],
      },
      attributes: {
        include: [
          [
            Sequelize.literal("LOG(`views_count` + 1) + `likes_count` * 2"),
            "score",
          ],
        ],
      },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "email", "avatar", ["user_name", "username"]],
          include: [
            {
              model: UserSetting,
              as: "settings",
              attributes: [
                "allow_comments",
                "show_view_counts",
                "require_comment_approval",
                "default_post_visibility",
                "push_notifications",
                "email_new_comments",
                "email_new_likes",
                "email_new_followers",
                "email_weekly_digest",
                "profile_visibility",
                "allow_direct_messages",
                "search_engine_indexing",
                "show_email",
              ],
            },
          ],
        },
        {
          model: Topic,
          as: "topics",
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
      order: [[Sequelize.literal("score"), "DESC"]],
      limit: 3,
    });

    return featuredPosts?.map((p) => {
      const post = p.toJSON();

      if (post.author?.settings) {
        post.author.settings = post.author.settings;
      }

      return post;
    });
  }

  async getLatestPosts(userId) {
    // lấy tất cả người mà mình follow (mình = following_id)
    const follows = await Follow.findAll({
      where: { following_id: userId },
      attributes: ["followed_id"], // user mà mình follow
    });
    const followingIds = follows.map((f) => f.followed_id);

    const latestPosts = await Post.findAll({
      where: {
        status: "published",
        [Op.or]: [
          { visibility: "public" },
          { visibility: "private", user_id: userId },
          { visibility: "followers", user_id: followingIds },
        ],
      },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "email", "avatar", ["user_name", "username"]],
          include: [
            {
              model: UserSetting,
              as: "settings",
              attributes: [
                "allow_comments",
                "show_view_counts",
                "require_comment_approval",
                "default_post_visibility",
                "push_notifications",
                "email_new_comments",
                "email_new_likes",
                "email_new_followers",
                "email_weekly_digest",
                "profile_visibility",
                "allow_direct_messages",
                "search_engine_indexing",
                "show_email",
              ],
            },
          ],
        },
        {
          model: Topic,
          as: "topics",
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
      order: [["published_at", "DESC"]],
      limit: 6,
    });

    return latestPosts?.map((p) => p.toJSON());
  }

  async getByStatus(status, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { rows: items, count: total } = await Post.findAndCountAll({
      where: { status },
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    return { items, total };
  }

  async getByKey(key) {
    const isId = /^\d+$/.test(key);
    const post = await Post.findOne({
      where: isId ? { id: key } : { slug: key },
      include: [Topic, Comment],
    });
    return post;
  }

  async getPostsByTopicSlug(slug, userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const topic = await Topic.findOne({
        where: { slug },
      });

      if (!topic) {
        return null;
      }

      // lấy danh sách user mà mình follow
      const follows = await Follow.findAll({
        where: { following_id: userId },
        attributes: ["followed_id"],
      });
      const followingIds = follows.map((f) => f.followed_id);

      // Lấy post kèm phân trang
      const { rows: posts, count } = await Post.findAndCountAll({
        where: {
          status: "published",
          [Op.or]: [
            { visibility: "public" },
            { visibility: "private", user_id: userId },
            { visibility: "followers", user_id: followingIds },
          ],
        },
        include: [
          {
            model: Topic,
            as: "topics",
            where: { id: topic.id },
            attributes: ["id", "name", "slug"],
            through: { attributes: [] },
          },
          {
            model: User,
            as: "author",
            attributes: ["id", ["user_name", "username"]],
          },
        ],
        distinct: true, // tránh bị count sai do join bảng trung gian
        limit,
        offset,
        order: [["created_at", "DESC"]],
      });

      return {
        posts,
        pagination: {
          total: count,
          page,
          limit,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }
  async schedulePost(data, userId) {
    try {
      const {
        title,
        content,
        description,
        cover,
        thumbnail,
        meta_title,
        meta_description,
        topics,
        visibility,
        status,
        publishDate,
        isScheduled,
      } = data;

      // tạo slug sau khi đã có title
      const slug = toSlug(title);

      const post = await Post.create({
        title,
        slug,
        content,
        description,
        cover,
        thumbnail,
        meta_title,
        meta_description,
        topics: JSON.stringify(topics || []),
        visibility,
        status: isScheduled ? "scheduled" : status || "draft",
        publishDate: isScheduled ? new Date(publishDate) : new Date(),
        user_id: userId,
      });

      if (isScheduled) {
        scheduleOnce(`publish_post_${post.id}`, publishDate, async () => {
          post.status = "published";
          post.published_at = new Date();

          await post.save();
          console.log(`✅ Post ${post.id} đã publish tự động!`);
        });
      }

      return post;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async create(data) {
    data.slug = toSlug(data.title);
    const topics = Array.isArray(data.topics) ? data.topics : [];
    delete data.topics;
    if (!data.visibility) {
      const userSetting = await UserSetting.findOne({
        where: { userId: data.userId },
      });
      data.visibility = userSetting?.defaultPostVisibility || "public"; // fallback
    }

    // tạo post trong transaction để atomic
    const result = await sequelize.transaction(async (t) => {
      const post = await Post.create(data, { transaction: t });

      if (topics.length > 0) {
        const topicInstances = await Promise.all(
          topics.map(async (tName) => {
            const [topic] = await Topic.findOrCreate({
              where: { name: tName },
              defaults: {
                slug: toSlug(tName),
              },
              transaction: t,
            });
            return topic;
          })
        );
        await post.setTopics(topicInstances, { transaction: t });
      }

      return post;
    });
    const fullPost = await result.reload({ include: ["topics", "author"] });

    const plainPost = fullPost.toJSON();
    plainPost.topics = plainPost.topics.map((t) => t.name);

    return plainPost;
  }

  async update(key, data) {
    const toSlug = (title) => {
      return `${slugify(title, { lower: true, strict: true })}-${nanoid(6)}`;
    };
    data.slug = toSlug(data.title);
    const isId = /^\d+$/.test(key);
    const post = await Post.update(data, {
      where: isId ? { id: key } : { slug: key },
    });
    return post;
  }

  async remove(key) {
    const isId = /^\d+$/.test(key);
    const post = await Post.destroy({
      where: isId ? { id: key } : { slug: key },
    });
    return post;
  }
}

module.exports = new PostsService();
