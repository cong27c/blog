"use strict";

require("module-alias/register");
const { faker } = require("@faker-js/faker");
const slugify = require("slugify");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const topics = [];
    const slugSet = new Set(); // Để kiểm tra slug trùng

    while (topics.length < 50) {
      const name = faker.word
        .words({ min: 1, max: 3 })
        .replace(/\b\w/g, (l) => l.toUpperCase());
      let baseSlug = slugify(name, { lower: true });

      let slug = baseSlug;
      let suffix = 1;

      // Nếu slug đã tồn tại, thêm hậu tố cho đến khi không trùng nữa
      while (slugSet.has(slug)) {
        slug = `${baseSlug}-${suffix++}`;
      }

      slugSet.add(slug);

      topics.push({
        name,
        slug,
        description: faker.lorem.sentences(2),
        image: faker.image.avatar(), // hoặc faker.image.url()
        posts_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("topics", topics);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("topics", null, {});
  },
};
