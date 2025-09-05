module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("faqs", [
      {
        question: "Làm thế nào để tạo bài viết mới?",
        answer:
          "Nếu bạn muốn tạo bài viết hãy nhập câu lệnh tạo bài viết + tiêu đề ..",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question: "Cách sửa bài viết?",
        answer:
          "Nếu bạn muốn sửa bài viết hãy nhập câu lệnh sửa bài viết + tiêu đề ..",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question: "Cách xóa bài viết?",
        answer:
          "Nếu bạn muốn xóa bài viết hãy nhập câu lệnh xóa bài viết + tiêu đề ..",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question: "Làm sao tìm kiếm bài viết?",
        answer:
          "Dùng SearchAgent, nhập câu lệnh: tìm bài viêt + tiêu đề bài viết đó ..",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        question: "Tôi cần trợ giúp về hệ thống?",
        answer: "Bạn có thể hỏi InfoAgent để nhận hướng dẫn và trả lời FAQ.",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("faqs", null, {});
  },
};
