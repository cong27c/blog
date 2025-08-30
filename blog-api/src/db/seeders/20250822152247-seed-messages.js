"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const messages = [];

    const sampleContents = [
      "Hello, how are you?",
      "What's up?",
      "Let's meet tomorrow!",
      "Did you check the new project?",
      "Great job on the report!",
      "See you soon!",
      "Have you eaten yet?",
      "I'm on my way 🚗",
      "Can you send me the file?",
      "😂😂😂",
      "Yes, absolutely!",
      "No worries, take your time.",
      "Did you watch the match last night?",
      "Let's grab a coffee ☕",
      "Working on the assignment rn",
      "That’s interesting 🤔",
      "I'll call you later.",
      "Are you free this weekend?",
      "I need your help with something.",
      "Thanks a lot 🙏",
      "Good night 🌙",
      "Morning! ☀️",
      "Hahaha that's so funny 🤣",
      "Congrats 🎉",
      "What do you mean?",
      "Just finished my work.",
      "Let's go out for dinner 🍽️",
      "Can't talk now, ttyl.",
      "Where are you?",
      "Send me the link, please.",
    ];

    // 1. Lấy danh sách users
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // 2. Lấy danh sách conversations
    const conversations = await queryInterface.sequelize.query(
      `SELECT id FROM conversation;`, // hoặc "conversations" tùy tên bảng thực
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users.length || !conversations.length) {
      throw new Error(
        "⚠️ Cần có dữ liệu users và conversations trước khi seed messages!"
      );
    }

    // 3. Tạo messages hợp lệ
    for (const user of users) {
      const conversation =
        conversations[Math.floor(Math.random() * conversations.length)];

      messages.push({
        user_id: user.id,
        conversation_id: conversation.id, // dùng id có thật
        type: "text",
        content: faker.helpers.arrayElement(sampleContents),
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("messages", messages, {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("messages", null, {});
  },
};
