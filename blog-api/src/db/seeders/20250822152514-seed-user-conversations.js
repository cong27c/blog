/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userConversations = [];

    // Lấy danh sách user_id thực sự từ bảng users (100 user đã seed trước đó)
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    for (const user of users) {
      const joinedConversations = new Set();

      // Mỗi user tham gia ít nhất 2 conversation random
      while (joinedConversations.size < 2) {
        const convId = Math.floor(Math.random() * 10) + 1; // 1 → 10
        joinedConversations.add(convId);
      }

      for (const convId of joinedConversations) {
        userConversations.push({
          user_id: user.id,
          conversation_id: convId,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }

    await queryInterface.bulkInsert("user_conversation", userConversations, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user_conversation", null, {});
  },
};
