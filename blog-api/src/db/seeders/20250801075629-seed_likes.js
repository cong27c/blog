"use strict";
const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const likes = [];
    const now = new Date();

    for (let likable_id = 125; likable_id <= 164; likable_id++) {
      const randomUserId = faker.helpers.arrayElement([83, 84]);

      likes.push({
        user_id: randomUserId,
        likable_type: "Post",
        likable_id: likable_id,
        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkInsert("likes", likes);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("likes", {
      likable_type: "Post",
      likable_id: {
        [Sequelize.Op.between]: [85, 124],
      },
    });
  },
};
