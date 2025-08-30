const { User, Follow, Post } = require("../models");
const transporter = require("../config/mailer");
const loadDigestTemplate = require("@/utils/loadDigestTemplate");

async function sendWeeklyDigestJob(job) {
  try {
    const { userId } = JSON.parse(job.payload);
    const user = await User.findByPk(userId);

    if (!user) {
      console.warn(`User ${userId} not found`);
      return;
    }

    // ====== Lấy dữ liệu thống kê ======

    // Tổng số followers
    const followers = await Follow.count({
      where: { following_id: user.id },
    });

    // Tổng like của tất cả bài post của user
    const totalLikes = await Post.sum("likes_count", {
      where: { user_id: user.id },
    });

    // Tổng views
    const totalViews = await Post.sum("views_count", {
      where: { user_id: user.id },
    });

    // Top 3 bài viết có views_count cao nhất
    const topPosts = await Post.findAll({
      where: { user_id: user.id },
      order: [["views_count", "DESC"]],
      limit: 3,
      attributes: ["id", "title", "views_count", "likes_count"],
    });

    // ====== Render email template ======
    const template = await loadDigestTemplate("digest/weeklyDigest", {
      name: user.user_name,
      followers,
      totalLikes: totalLikes || 0,
      totalViews: totalViews || 0,
      topPosts: topPosts.map((p) => p.toJSON()),
    });

    // ====== Gửi email ======
    await transporter.sendMail({
      from: "nguyenvancongcbg1@gmail.com",
      subject: "Your Weekly Digest",
      to: user.email,
      html: template,
    });

    console.log(`Weekly digest sent to ${user.email}`);
  } catch (error) {
    console.error("Error in sendWeeklyDigestJob:", error);
    throw error; // để queue xử lý retry
  }
}

module.exports = sendWeeklyDigestJob;
