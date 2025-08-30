module.exports = {
  async up(queryInterface, Sequelize) {
    const conversations = [];

    for (let i = 1; i <= 10; i++) {
      conversations.push({
        id: i,
        name: `Conversation ${i}`,
        avatar: `https://i.pravatar.cc/150?img=${i}`, // ảnh random cho đẹp
        last_message_at: new Date(
          Date.now() - Math.floor(Math.random() * 100000000)
        ),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("conversation", conversations, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("conversation", null, {});
  },
};
