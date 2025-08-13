module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("posts", "topic_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("posts", "topic_id", {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: "Topic",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },
};
