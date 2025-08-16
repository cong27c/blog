"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(`SELECT id FROM users`, {
      type: Sequelize.QueryTypes.SELECT,
    });
    const posts = await queryInterface.sequelize.query(`SELECT id FROM posts`, {
      type: Sequelize.QueryTypes.SELECT,
    });

    if (!users.length || !posts.length) {
      throw new Error("⚠️ Cần seed users & posts trước khi seed comments!");
    }

    /* -------- 1. Insert 800 comment gốc -------- */
    const rootComments = [];
    for (let i = 0; i < 800; i++) {
      const user = faker.helpers.arrayElement(users);
      const post = faker.helpers.arrayElement(posts);

      rootComments.push({
        post_id: post.id,
        user_id: user.id,
        content: faker.lorem.sentences(3),
        parent_id: null,
        created_at: faker.date.recent({ days: 30 }),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("comments", rootComments);

    // Lấy lại id của 800 comment gốc
    const insertedRoots = await queryInterface.sequelize.query(
      `SELECT id, post_id FROM comments ORDER BY id DESC LIMIT 800`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    /* -------- 2. Sinh reply trực tiếp cho mỗi comment gốc -------- */
    const replies = [];
    for (const root of insertedRoots) {
      const replyCount = faker.number.int({ min: 0, max: 3 }); // tối đa 3 replies
      for (let j = 0; j < replyCount; j++) {
        const replyUser = faker.helpers.arrayElement(users);
        replies.push({
          post_id: root.post_id,
          user_id: replyUser.id,
          content: faker.lorem.sentences(2),
          parent_id: root.id, // reply trực tiếp cho root
          created_at: faker.date.recent({ days: 30 }),
          updated_at: new Date(),
        });
      }
    }

    if (replies.length) {
      await queryInterface.bulkInsert("comments", replies);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("comments", null);
  },
};
