"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Lấy danh sách posts và topics thật từ DB
    const posts = await queryInterface.sequelize.query(
      `SELECT id FROM posts LIMIT 1000`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const topics = await queryInterface.sequelize.query(
      `SELECT id FROM topics LIMIT 100`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!posts.length || !topics.length) {
      throw new Error("⚠️ Cần seed posts & topics trước khi seed posttopics!");
    }

    // 2. Sinh dữ liệu posttopics (không trùng lặp trong cùng lần chạy)
    const postTopics = [];
    const now = new Date();

    for (const post of posts) {
      // mỗi post gán ngẫu nhiên 1–3 topics
      const selectedTopics = faker.helpers.arrayElements(
        topics,
        faker.number.int({ min: 1, max: 3 })
      );

      for (const topic of selectedTopics) {
        const key = `${post.id}-${topic.id}`;
        if (!postTopics.some((pt) => `${pt.post_id}-${pt.topic_id}` === key)) {
          postTopics.push({
            post_id: post.id,
            topic_id: topic.id,
            created_at: now,
            updated_at: now,
          });
        }
      }
    }

    // 3. Insert vào bảng posttopics (bỏ qua bản ghi đã tồn tại)
    await queryInterface.bulkInsert("posttopics", postTopics, {
      ignoreDuplicates: true, // ✅ chống lỗi trùng lặp khi chạy lại
    });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("posttopics", null, {});
  },
};
