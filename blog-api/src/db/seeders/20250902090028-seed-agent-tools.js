"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    const agentTools = [
      {
        agent_id: 1,
        name: "SearchPosts",
        toolType: "search",
        config: JSON.stringify({ description: "Tìm bài viết trong blog" }),
        created_at: now,
        updated_at: now,
      },
      {
        agent_id: 2,
        name: "CreatePost",
        toolType: "create",
        config: JSON.stringify({ description: "Tạo bài viết mới (của bạn)" }),
        created_at: now,
        updated_at: now,
      },
      {
        agent_id: 2,
        name: "UpdatePost",
        toolType: "update",
        config: JSON.stringify({ description: "Cập nhật bài viết của bạn" }),
        created_at: now,
        updated_at: now,
      },
      {
        agent_id: 2,
        name: "DeletePost",
        toolType: "delete",
        config: JSON.stringify({ description: "Xóa bài viết của bạn" }),
        created_at: now,
        updated_at: now,
      },
      {
        agent_id: 3,
        name: "FAQ",
        toolType: "faq",
        config: JSON.stringify({
          description: "Trả lời câu hỏi dựa trên FAQ + LLM nếu không tìm thấy",
        }),
        created_at: now,
        updated_at: now,
      },
    ];

    await queryInterface.bulkInsert("AgentTools", agentTools);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("AgentTools", { agent_id: 1 });
  },
};
