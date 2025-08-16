"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("users");

    if (!tableInfo.skills) {
      await queryInterface.addColumn("users", "skills", {
        type: Sequelize.JSON,
        allowNull: true,
      });
    }

    if (!tableInfo.privacy) {
      await queryInterface.addColumn("users", "privacy", {
        type: Sequelize.JSON,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("users");

    if (tableInfo.skills) {
      await queryInterface.removeColumn("users", "skills");
    }

    if (tableInfo.privacy) {
      await queryInterface.removeColumn("users", "privacy");
    }
  },
};
