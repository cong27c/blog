"use strict";

const { faker } = require("@faker-js/faker");
faker.locale = "en";

const slugify = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");

const titles = [
  "5 mẹo học lập trình hiệu quả",
  "So sánh React và Vue năm 2025",
  "Lập trình web từ A đến Z",
  "Cách tối ưu hiệu suất trong Node.js",
  "Tại sao bạn nên học TypeScript năm nay",
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const usedSlugs = new Set();
    const posts = [];

    for (let i = 0; i < 40; i++) {
      const title = faker.helpers.arrayElement(titles);
      let slugBase = slugify(title);
      let slug = slugBase;
      let counter = 1;

      while (usedSlugs.has(slug)) {
        slug = `${slugBase}-${counter++}`;
      }
      usedSlugs.add(slug);

      const status = faker.helpers.arrayElement(["draft", "active", "banned"]);
      const createdAt = faker.date.recent(90);
      const publishedAt = status === "active" ? faker.date.recent(365) : null;

      posts.push({
        user_id: faker.helpers.arrayElement([83, 84]),
        title,
        description: "Bài viết chia sẻ kinh nghiệm thật từ thực tế lập trình.",
        meta_title: title,
        meta_description: "Khám phá thêm thông tin về " + title,
        slug,
        thumbnail: `https://picsum.photos/seed/${slug}/800/400`,
        cover: `https://picsum.photos/seed/${slug}-cover/800/400`,
        content: faker.lorem.paragraphs(
          faker.number.int({ min: 3, max: 5 }),
          "\n\n"
        ),
        status,
        visibility: faker.helpers.arrayElement(["public", "private"]),
        views_count: faker.number.int({ min: 0, max: 5000 }),
        likes_count: faker.number.int({ min: 0, max: 5000 }),
        published_at: publishedAt,
        created_at: createdAt,
        updated_at: createdAt,
      });
    }

    await queryInterface.bulkInsert("posts", posts, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("posts", null, {});
  },
};
