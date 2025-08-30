"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("notifications", "link", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "notifiable_id", // đặt sau cột notifiable_id (nếu DB hỗ trợ, MySQL có hỗ trợ)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("notifications", "link");
  },
};
