"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("agentTools", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      agent_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "agents",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      toolType: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "custom",
      },
      config: {
        type: Sequelize.JSON, // <-- sửa ở đây
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("agentTools");
  },
};
