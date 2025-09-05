"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("conversation", "agent_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "agents", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });

    await queryInterface.addColumn("conversation", "context", {
      type: Sequelize.JSON, // <-- đổi từ JSONB sang JSON
      allowNull: true,
    });

    await queryInterface.addColumn("conversation", "status", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "active",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("conversation", "agent_id");
    await queryInterface.removeColumn("conversation", "context");
    await queryInterface.removeColumn("conversation", "status");
  },
};
