"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const records = [];

    for (let postId = 125; postId <= 164; postId++) {
      const topicCount = faker.number.int({ min: 1, max: 3 });
      const chosenTopicIds = new Set();

      while (chosenTopicIds.size < topicCount) {
        const topicId = faker.number.int({ min: 1, max: 32 });
        chosenTopicIds.add(topicId);
      }

      for (const topicId of chosenTopicIds) {
        records.push({
          post_id: postId,
          topic_id: topicId,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert("posttopics", records, {}); // <- CHỈNH TÊN BẢNG
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "posttopics",
      {
        post_id: { [Sequelize.Op.between]: [85, 124] },
      },
      {}
    );
  },
};
