"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("users");
    if (!tableInfo.verified_at) {
      await queryInterface.addColumn("users", "verified_at", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable("users");
    if (tableInfo.verified_at) {
      await queryInterface.removeColumn("users", "verified_at");
    }
  },
};
