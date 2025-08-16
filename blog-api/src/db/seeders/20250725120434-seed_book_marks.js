"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Lấy danh sách user và post
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users LIMIT 500`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    const posts = await queryInterface.sequelize.query(
      `SELECT id FROM posts LIMIT 1000`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users.length || !posts.length) {
      throw new Error(
        "⚠️ Cần có dữ liệu users và posts trước khi seed bookmarks!"
      );
    }

    // 2. Sinh dữ liệu bookmarks
    const bookmarks = [];
    const createdAt = new Date();

    for (const user of users) {
      // mỗi user bookmark ngẫu nhiên 3–10 posts
      const bookmarkPosts = faker.helpers.arrayElements(
        posts,
        faker.number.int({ min: 3, max: 10 })
      );

      for (const post of bookmarkPosts) {
        bookmarks.push({
          user_id: user.id,
          post_id: post.id,
          created_at: createdAt,
          updated_at: createdAt,
        });
      }
    }

    // 3. Insert vào bảng bookmarks
    await queryInterface.bulkInsert("bookmarks", bookmarks);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("bookmarks", null, {});
  },
};
