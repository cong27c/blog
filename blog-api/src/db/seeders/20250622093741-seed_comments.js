"use strict";

const { faker } = require("@faker-js/faker");

module.exports = {
  async up(queryInterface, Sequelize) {
    const comments = [];
    const userIds = [83, 84];
    const itComments = [
      "ReactJS là framework tuyệt vời cho SPA.",
      "Mình thích Next.js vì khả năng SSR.",
      "TypeScript giúp code dễ bảo trì hơn rất nhiều.",
      "Node.js xử lý bất đồng bộ rất mạnh mẽ.",
      "Express.js là lựa chọn nhẹ và nhanh cho backend.",
      "Vue.js dễ học và rất linh hoạt.",
      "Dùng TailwindCSS giúp CSS gọn gàng hơn.",
      "GraphQL giúp query dữ liệu linh hoạt hơn REST API.",
      "MongoDB rất hợp cho các ứng dụng NoSQL.",
      "Docker giúp triển khai ứng dụng dễ dàng.",
      "Prisma ORM dễ dùng hơn Sequelize.",
      "NestJS tổ chức code rất tốt.",
      "Sử dụng Redux Toolkit để quản lý state gọn hơn.",
      "Vite build frontend rất nhanh.",
      "MySQL vẫn là lựa chọn phổ biến cho database.",
    ];

    for (let i = 0; i < 50; i++) {
      comments.push({
        user_id: userIds[Math.floor(Math.random() * userIds.length)],
        post_id: Math.floor(Math.random() * (164 - 125 + 1)) + 125,
        parent_id: null, // có thể random cho nested comment nếu cần
        content: itComments[Math.floor(Math.random() * itComments.length)],
        deleted_at: null,
        created_at: faker.date.past(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("comments", comments, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("comments", null, {});
  },
};
