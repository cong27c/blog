"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user_conversation", "role", {
      type: Sequelize.ENUM("member", "admin"),
      allowNull: false,
      defaultValue: "member",
    });

    await queryInterface.addColumn(
      "user_conversation",
      "last_read_message_id",
      {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: "messages",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }
    );

    await queryInterface.addColumn("user_conversation", "joined_at", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("user_conversation", "role");
    await queryInterface.removeColumn(
      "user_conversation",
      "last_read_message_id"
    );
    await queryInterface.removeColumn("user_conversation", "joined_at");
  },
};
