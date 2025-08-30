"use strict";

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

    const validUserIds = [
      600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614,
      615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629,
      630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644,
      645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659,
      660, 661, 662, 663, 664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674,
      675, 676, 677, 678, 679, 680, 681, 682, 683, 684, 693, 695, 696,
    ];

    // user_id từ 600 -> 696
    for (const userId of validUserIds) {
      messages.push({
        user_id: userId,
        conversation_id: Math.floor(Math.random() * 10) + 1, // random từ 1 -> 5
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
