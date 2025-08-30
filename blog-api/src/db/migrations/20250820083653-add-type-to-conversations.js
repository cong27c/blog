module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("conversation", "type", {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: "direct", // direct | group
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("conversation", "type");
  },
};
