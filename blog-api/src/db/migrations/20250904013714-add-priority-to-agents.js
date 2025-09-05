module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("agents", "priority", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("agents", "priority");
  },
};
