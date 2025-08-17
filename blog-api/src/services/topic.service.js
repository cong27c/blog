const { Topic, Post } = require("@/models/index");
const { where, Op } = require("sequelize");

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // cộng 1 vì tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
class TopicsService {
  async getAll(page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const { rows: items, count: total } = await Topic.findAndCountAll({
      include: [
        {
          model: Post,
          as: "posts",
        },
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });
    return { items, total };
  }
  async getTrendingTopic(limit = 6) {
    // lấy tất cả topics
    const topics = await Topic.findAll();

    // map qua từng topic để đếm số bài viết
    const withCounts = await Promise.all(
      topics.map(async (topic) => {
        const count = await topic.countPosts(); // Sequelize tự sinh khi có association
        return {
          ...topic.get({ plain: true }),
          posts_count: count,
        };
      })
    );

    // sắp xếp giảm dần theo countPosts và giới hạn
    withCounts.sort((a, b) => b.countPosts - a.countPosts);
    return withCounts.slice(0, limit);
  }

  async getTopicBySlug(slug) {
    const topic = await Topic.findOne({ where: { slug } });
    if (!topic) return null;

    const postCount = await topic.countPosts();
    return {
      id: topic.id,
      name: topic.name,
      slug: topic.slug,
      description: topic.description,
      icon: topic.image,
      postCount,
      createdAt: formatDate(topic.created_at),
    };
  }

  async getPostsByTopicSlug(slug, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    // const topic = await Topic.findOne({ where: { slug } });
    // if (!topic) return null;
    const posts = await Post.findAndCountAll({
      where: { status: "published" },
      include: [
        {
          model: Topic,
          as: "topics",
          where: { slug },
          attributes: [],
          through: { attributes: [] },
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });
    return posts;
    // return {
    //   posts: rows,
    //   pagination: {
    //     totalPosts: count,
    //     totalPages: Math.ceil(count / limit),
    //     currentPage: page,
    //   },
    // };
  }

  async getById(topic_name) {
    const topic = await Topic.findOne({ where: { topic_name }, include: Post });
    return topic;
  }

  async create(data) {
    const topic = await Topic.create(data);
    return topic;
  }

  async update(topic_name, data) {
    const topic = await Topic.update(data, {
      where: {
        topic_name,
      },
    });
    return topic;
  }

  async remove(topic_name) {
    const topic = await Topic.destroy({ where: { topic_name } });
    return topic;
  }
}

module.exports = new TopicsService();
