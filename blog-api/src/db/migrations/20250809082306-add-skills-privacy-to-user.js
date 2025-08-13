"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "skills", {
      type: Sequelize.JSON,
      allowNull: true,
    });

    await queryInterface.addColumn("Users", "privacy", {
      type: Sequelize.JSON,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "skills");
    await queryInterface.removeColumn("Users", "privacy");
  },
};
