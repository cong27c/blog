"use strict";
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const topics = [];
    const usedNames = new Set();

    while (topics.length < 5) {
      const name = faker.lorem.word();

      if (!usedNames.has(name)) {
        usedNames.add(name);

        topics.push({
          topic_name: name,
        });
      }
    }

    await queryInterface.bulkInsert("topics", topics);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("topics", null, {});
  },
};
