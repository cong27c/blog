"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const messages = [];

    // Một vài content mẫu
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

    // Lấy danh sách user_id từ bảng users (dùng queryInterface)
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM users;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Tạo message cho mỗi user
    for (const user of users) {
      messages.push({
        user_id: user.id,
        conversation_id: Math.floor(Math.random() * 10) + 1, // random từ 1 -> 10
        type: "text",
        content:
          sampleContents[Math.floor(Math.random() * sampleContents.length)],
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("messages", messages, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("messages", null, {});
  },
};
