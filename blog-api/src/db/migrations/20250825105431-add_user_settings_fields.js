"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user_settings", "export_data", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
    await queryInterface.addColumn("user_settings", "two_factor_secret", {
      type: Sequelize.STRING,
      allowNull: true, // để null vì chỉ có khi bật 2FA mới lưu
    });
    await queryInterface.addColumn("user_settings", "two_factor_enabled", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn("user_settings", "default_post_visibility", {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: "public",
    });
    await queryInterface.addColumn("user_settings", "allow_comments", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn(
      "user_settings",
      "require_comment_approval",
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }
    );
    await queryInterface.addColumn("user_settings", "show_view_counts", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("user_settings", "email_new_comments", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("user_settings", "email_new_likes", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("user_settings", "email_new_followers", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("user_settings", "email_weekly_digest", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("user_settings", "push_notifications", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("user_settings", "profile_visibility", {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: "public",
    });
    await queryInterface.addColumn("user_settings", "allow_direct_messages", {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: "everyone",
    });
    await queryInterface.addColumn("user_settings", "search_engine_indexing", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn("user_settings", "show_email", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("user_settings", "export_data");

    await queryInterface.removeColumn("user_settings", "two_factor_secret");

    await queryInterface.removeColumn("user_settings", "two_factor_enabled");
    await queryInterface.removeColumn(
      "user_settings",
      "default_post_visibility"
    );
    await queryInterface.removeColumn("user_settings", "allow_comments");
    await queryInterface.removeColumn(
      "user_settings",
      "require_comment_approval"
    );
    await queryInterface.removeColumn("user_settings", "show_view_counts");
    await queryInterface.removeColumn("user_settings", "email_new_comments");
    await queryInterface.removeColumn("user_settings", "email_new_likes");
    await queryInterface.removeColumn("user_settings", "email_new_followers");
    await queryInterface.removeColumn("user_settings", "email_weekly_digest");
    await queryInterface.removeColumn("user_settings", "push_notifications");
    await queryInterface.removeColumn("user_settings", "profile_visibility");
    await queryInterface.removeColumn("user_settings", "allow_direct_messages");
    await queryInterface.removeColumn(
      "user_settings",
      "search_engine_indexing"
    );
    await queryInterface.removeColumn("user_settings", "show_email");
  },
};
