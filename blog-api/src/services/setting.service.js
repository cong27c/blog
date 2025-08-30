const { UserSetting, User } = require("@/models/index");
const jwtService = require("./jwt.service");
const queue = require("@/utils/queue");
const { MAIL_SECRET } = require("@/config/auth");
const { where } = require("sequelize");

const getUserSettings = async (userId) => {
  if (!userId) return;
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found");

  const [settings] = await UserSetting.findOrCreate({
    where: { user_id: userId },
    defaults: { user_id: userId },
  });
  if (!settings) {
    return {
      email: user.email,
      twoFactorEnabled: false,
      defaultPostVisibility: "public",
      allowComments: true,
      requireCommentApproval: false,
      showViewCounts: true,
      emailNewComments: true,
      emailNewLikes: true,
      emailNewFollowers: true,
      emailWeeklyDigest: true,
      pushNotifications: true,
      profileVisibility: "public",
      allowDirectMessages: "everyone",
      searchEngineIndexing: true,
      showEmail: false,
    };
  }

  return {
    email: user.email,
    twoFactorEnabled: settings.two_factor_enabled,
    defaultPostVisibility: settings.default_post_visibility,
    allowComments: settings.allow_comments,
    requireCommentApproval: settings.require_comment_approval,
    showViewCounts: settings.show_view_counts,
    emailNewComments: settings.email_new_comments,
    emailNewLikes: settings.email_new_likes,
    emailNewFollowers: settings.email_new_followers,
    emailWeeklyDigest: settings.email_weekly_digest,
    pushNotifications: settings.push_notifications,
    profileVisibility: settings.profile_visibility,
    allowDirectMessages: settings.allow_direct_messages,
    searchEngineIndexing: settings.search_engine_indexing,
    showEmail: settings.show_email,
  };
};

const getAuthorSettings = async (authorId) => {
  if (!authorId) return;

  const user = await User.findByPk(authorId);
  if (!user) throw new Error("User not found");

  const [settings] = await UserSetting.findOrCreate({
    where: { user_id: authorId },
    defaults: { user_id: authorId },
  });
  if (!settings) {
    return {
      email: user.email,
      twoFactorEnabled: false,
      defaultPostVisibility: "public",
      allowComments: true,
      requireCommentApproval: false,
      showViewCounts: true,
      emailNewComments: true,
      emailNewLikes: true,
      emailNewFollowers: true,
      emailWeeklyDigest: true,
      pushNotifications: true,
      profileVisibility: "public",
      allowDirectMessages: "everyone",
      searchEngineIndexing: true,
      showEmail: false,
    };
  }
  return {
    email: user.email,
    twoFactorEnabled: settings.two_factor_enabled,
    defaultPostVisibility: settings.default_post_visibility,
    allowComments: settings.allow_comments,
    requireCommentApproval: settings.require_comment_approval,
    showViewCounts: settings.show_view_counts,
    emailNewComments: settings.email_new_comments,
    emailNewLikes: settings.email_new_likes,
    emailNewFollowers: settings.email_new_followers,
    emailWeeklyDigest: settings.email_weekly_digest,
    pushNotifications: settings.push_notifications,
    profileVisibility: settings.profile_visibility,
    allowDirectMessages: settings.allow_direct_messages,
    searchEngineIndexing: settings.search_engine_indexing,
    showEmail: settings.show_email,
  };
};

const updateSettings = async (userId, data) => {
  try {
    const payload = {
      two_factor_enabled: data.twoFactorEnabled,
      two_factor_secret: data.twoFactorSecret || null,
      default_post_visibility: data.defaultPostVisibility,
      allow_comments: data.allowComments,
      require_comment_approval: data.requireCommentApproval,
      show_view_counts: data.showViewCounts,
      email_new_comments: data.emailNewComments,
      email_new_likes: data.emailNewLikes,
      email_new_followers: data.emailNewFollowers,
      email_weekly_digest: data.emailWeeklyDigest,
      push_notifications: data.pushNotifications,
      profile_visibility: data.profileVisibility,
      allow_direct_messages: data.allowDirectMessages,
      search_engine_indexing: data.searchEngineIndexing,
      show_email: data.showEmail,
    };
    const user = await User.findByPk(userId);

    await UserSetting.update(payload, {
      where: { user_id: userId },
    });

    const settings = await UserSetting.findOne({ where: { user_id: userId } });
    return {
      email: user.email,
      twoFactorEnabled: settings.two_factor_enabled,
      defaultPostVisibility: settings.default_post_visibility,
      allowComments: settings.allow_comments,
      requireCommentApproval: settings.require_comment_approval,
      showViewCounts: settings.show_view_counts,
      emailNewComments: settings.email_new_comments,
      emailNewLikes: settings.email_new_likes,
      emailNewFollowers: settings.email_new_followers,
      emailWeeklyDigest: settings.email_weekly_digest,
      pushNotifications: settings.push_notifications,
      profileVisibility: settings.profile_visibility,
      allowDirectMessages: settings.allow_direct_messages,
      searchEngineIndexing: settings.search_engine_indexing,
      showEmail: settings.show_email,
    };
  } catch (error) {
    console.log(error);
  }
};

const requestUpdateEmail = async (userId, email) => {
  if (!email) throw new Error("Email không được để trống");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) throw new Error("Email không hợp lệ");

  const exists = await User.findOne({ where: { email } });
  if (exists) throw new Error("Email đã được sử dụng");

  queue.dispatch("sendVerifyEmailJob", {
    userId,
    email,
    type: "verify-setting",
  });

  return { message: "Vui lòng kiểm tra email để xác thực" };
};
const confirmUpdateEmail = async (token) => {
  try {
    console.log("TOKEN INPUT:", token, typeof token);

    const { userId, email } = jwtService.verifyAccessToken(token, MAIL_SECRET);

    const user = await User.findByPk(userId);
    if (!user) throw new Error("User không tồn tại");
    // console.log("USER BEFORE", user);
    user.email = email;
    user.verified_at = new Date();
    await user.save();
    // console.log("USER AFTER", user);

    return { message: "Email đã được cập nhật thành công", user };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error("Token đã hết hạn, vui lòng yêu cầu cập nhật lại email");
    }
    throw err;
  }
};

const exportUserData = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ["id", "user_name", "email"],
  });
  const settings = await UserSetting.findOne({ where: { user_id: userId } });
  console.log(settings);
  if (!user) throw new Error("User not found");

  return {
    user_name: user.user_name,
    email: user.email,
    settings,
    exportDate: new Date().toISOString(),
  };
};

module.exports = {
  exportUserData,
  requestUpdateEmail,
  confirmUpdateEmail,
  getAuthorSettings,
  updateSettings,
  getUserSettings,
};
