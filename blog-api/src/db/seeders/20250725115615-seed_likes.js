"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Lấy user và post thật từ DB
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users LIMIT 500`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const posts = await queryInterface.sequelize.query(
      `SELECT id FROM posts LIMIT 1000`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users.length || !posts.length) {
      throw new Error("⚠️ Cần seed users & posts trước khi seed likes!");
    }

    // 2. Tạo likes
    const likes = [];
    const now = new Date();

    // Ví dụ: mỗi user sẽ like ngẫu nhiên 5–20 posts
    for (const user of users) {
      const likedPosts = faker.helpers.arrayElements(
        posts,
        faker.number.int({ min: 5, max: 20 })
      );

      for (const post of likedPosts) {
        likes.push({
          user_id: user.id,
          likable_type: "Post", // polymorphic type
          likable_id: post.id, // chính là post_id
          created_at: now,
          updated_at: now,
        });
      }
    }

    // 3. Insert vào bảng likes
    await queryInterface.bulkInsert("likes", likes);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("likes", null, {});
  },
};
