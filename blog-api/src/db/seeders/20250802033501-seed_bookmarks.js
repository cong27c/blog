"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const { faker } = require("@faker-js/faker");

    const bookmarks = [];
    const usedPairs = new Set(); // để tránh trùng user_id + post_id

    while (bookmarks.length < 40) {
      const userId = faker.helpers.arrayElement([83, 84]);
      const postId = faker.number.int({ min: 125, max: 164 });
      const key = `${userId}-${postId}`;

      if (usedPairs.has(key)) continue;
      usedPairs.add(key);

      const createdAt = faker.date.recent(90);

      bookmarks.push({
        user_id: userId,
        post_id: postId,
        created_at: createdAt,
        updated_at: createdAt,
      });
    }

    await queryInterface.bulkInsert("bookmarks", bookmarks, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("bookmarks", null, {});
  },
};
