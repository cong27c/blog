"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const topicNames = [
      "JavaScript",
      "Python",
      "TypeScript",
      "React",
      "Vue",
      "Angular",
      "Node.js",
      "Express",
      "Django",
      "Flask",
      "Laravel",
      "Ruby on Rails",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "GraphQL",
      "Redux",
      "Next.js",
      "Tailwind CSS",
      "Bootstrap",
      "Svelte",
      "NestJS",
      "Kotlin",
      "Swift",
      "Java",
      ".NET",
      "Spring Boot",
      "Go",
      "Rust",
      "C#",
      "C++",
      "PHP",
    ];

    const topics = topicNames.map((name) => {
      const slug = faker.helpers.slugify(name.toLowerCase());

      return {
        name,
        slug: `${slug}-${faker.string.uuid().slice(0, 8)}`,
        image: faker.image.urlLoremFlickr({ category: "technology" }),
        description: faker.lorem.sentence({ min: 10, max: 20 }),
        posts_count: faker.number.int({ min: 0, max: 100 }),
        created_at: new Date(),
        updated_at: new Date(),
      };
    });

    await queryInterface.bulkInsert("topics", topics, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("topics", null, {});
  },
};
