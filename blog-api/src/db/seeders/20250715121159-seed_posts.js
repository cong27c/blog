"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Lấy danh sách users
    const users = await queryInterface.sequelize.query(
      `SELECT id, user_name, avatar FROM users LIMIT 1000`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users.length) {
      throw new Error("⚠️ Không có user để gán user_id cho posts.");
    }

    // 2. Hàm sinh nội dung HTML
    const generateContent = () => {
      let html = "";

      html += `<h1>${faker.lorem.words({ min: 5, max: 10 })}</h1>`;
      html += `<p>${faker.lorem.paragraph()}</p>`;

      html += `<h2>${faker.lorem.words({ min: 3, max: 6 })}</h2>`;
      html += `<p>${faker.lorem.paragraphs(2, "<br/><br/>")}</p>`;

      html += `<h3>${faker.lorem.words({ min: 2, max: 4 })}</h3>`;
      html += `<img src="${faker.image.url({
        width: 1200,
        height: 600,
        category: "nature",
        randomize: true,
      })}" alt="${faker.lorem.word()}" />`;

      html += "<ul>";
      Array.from({ length: faker.number.int({ min: 3, max: 6 }) }).forEach(
        () => {
          html += `<li><strong>${faker.lorem.word()}:</strong> ${faker.lorem.sentence()}</li>`;
        }
      );
      html += "</ul>";

      html += `<pre><code>${faker.lorem.paragraphs(3, "\n")}</code></pre>`;
      html += `<blockquote><p>${faker.lorem.paragraph()}</p></blockquote>`;

      return html;
    };

    // 3. Tạo dữ liệu posts
    const posts = [];
    const now = new Date();

    for (let i = 0; i < 300; i++) {
      const author = faker.helpers.arrayElement(users);

      posts.push({
        user_id: author.id, // 🔑 Bắt buộc thêm foreign key này
        title: faker.lorem.sentence({ min: 6, max: 12 }),
        slug: faker.helpers.slugify(faker.lorem.slug()),
        content: generateContent(),
        description: faker.lorem.sentences(2),
        meta_title: faker.lorem.words({ min: 3, max: 6 }),
        meta_description: faker.lorem.sentence(),
        status: faker.helpers.arrayElement(["published", "draft", "pending"]),
        views_count: faker.number.int({ min: 0, max: 5000 }),
        likes_count: 0,
        visibility: faker.helpers.arrayElement(["public", "private"]),
        cover: faker.image.url({
          width: 1200,
          height: 600,
          category: "nature",
          randomize: true,
        }),
        thumbnail: faker.image.url({
          width: 400,
          height: 300,
          category: "abstract",
          randomize: true,
        }),
        published_at: now,
        created_at: now,
        updated_at: now,
      });
    }

    await queryInterface.bulkInsert("posts", posts);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("posts", null, {});
  },
};
