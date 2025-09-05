"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("messages", "agent_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "agents", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("messages", "metadata", {
      type: Sequelize.JSON, // <-- đổi từ JSONB sang JSON
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("messages", "agent_id");
    await queryInterface.removeColumn("messages", "metadata");
  },
};
