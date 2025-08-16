"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("users");
    if (!tableInfo.cover_image) {
      await queryInterface.addColumn("users", "cover_image", {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("users");
    if (tableInfo.cover_image) {
      await queryInterface.removeColumn("users", "cover_image");
    }
  },
};
