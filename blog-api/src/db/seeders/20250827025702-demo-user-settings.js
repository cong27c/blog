"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Lấy danh sách user_id thực tế từ bảng users
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const data = users.map((user) => ({
      user_id: user.id,
      two_factor_secret: null,
      two_factor_enabled: false,
      default_post_visibility: "public", // "public" | "private" | "followers"
      allow_comments: true,
      require_comment_approval: false,
      show_view_counts: true,
      email_new_comments: true,
      email_new_likes: true,
      email_new_followers: true,
      email_weekly_digest: true,
      push_notifications: true,
      profile_visibility: "public", // "public" | "private"
      allow_direct_messages: "everyone", // "everyone" | "followers" | "no_one"
      search_engine_indexing: true,
      show_email: false,
      created_at: now,
      updated_at: now,
    }));

    await queryInterface.bulkInsert("user_settings", data, {});
  },

  async down(queryInterface, Sequelize) {
    // Xóa tất cả user_settings của các user trong bảng users
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    await queryInterface.bulkDelete("user_settings", {
      user_id: users.map((u) => u.id),
    });
  },
};
