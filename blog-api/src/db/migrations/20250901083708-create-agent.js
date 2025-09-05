"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("agents", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pattern: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "gpt-3.5-turbo",
      },
      temperature: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0.7,
      },
      maxTokens: { type: Sequelize.INTEGER, allowNull: true },
      description: { type: Sequelize.STRING, allowNull: true },
      systemPrompt: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable("agents");
  },
};
