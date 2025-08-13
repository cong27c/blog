const { User } = require("@/models");
const { hash, compare } = require("@/utils/bcrypt");
const jwtService = require("./jwt.service");
const refreshTokenService = require("./refreshToken.service");
const transporter = require("@/config/mailer");
const { MAIL_SECRET, MAIL_EXPIRES_IN } = require("@/config/auth");
const { where } = require("sequelize");
const loadEmailTemplate = require("@/utils/loadEmailTemplate");
const queue = require("@/utils/queue");

/**
 * Register new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Token data
 */
const register = async (data, res) => {
  try {
    const { dataValues: user } = await User.create({
      email: data.email,
      password: await hash(data.password),
      first_name: data.firstName,
      last_name: data.lastName,
      user_name: data.email?.split("@")[0],
    });
    const userId = user.id;
    if (!userId) {
      throw new Error("Thông tin người dùng không hợp lệ.");
    }
    queue.dispatch("sendVerifyEmailJob", { userId, type: "verify" });

    const accessToken = jwtService.generateAccessToken(userId);
    const refreshToken = await refreshTokenService.createRefreshToken(userId);

    // Gửi cookie chứa refresh_token
    res.cookie("refresh_token", refreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      path: "/",
    });

    return {
      ...accessToken,
    };
  } catch (error) {
    console.log(error);
  }
};

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Thông tin đăng nhập không hợp lệ.");
  }

  const isValid = await compare(password, user.dataValues.password);

  if (!isValid) {
    throw new Error("Thông tin đăng nhập không hợp lệ.");
  }

  const tokenData = jwtService.generateAccessToken(user.dataValues.id);

  const refreshToken = await refreshTokenService.createRefreshToken(
    user.dataValues.id
  );

  return {
    ...tokenData,
    refresh_token: refreshToken.token,
  };
};

const verify = async (token) => {
  try {
    if (!token) {
      throw new Error("Token không tồn tại hoặc đã hết hạn");
    }
    const { userId } = jwtService.verifyAccessToken(token, MAIL_SECRET);

    const user = await User.findOne({
      where: { id: userId },
    });

    user.verified_at = Date.now();

    await user.save();

    return user;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    const { userId } = jwtService.verifyAccessToken(token, MAIL_SECRET);

    const user = await User.findOne({
      where: { id: userId },
    });
    // password: await hash(data.password),
    const hashNewPassword = await hash(newPassword);

    await User.update({ password: hashNewPassword }, { where: { id: userId } });

    return user;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

/**
 * Refresh access token
 * @param {string} refreshTokenString - Refresh token
 * @returns {Object} New token data with new refresh token
 * @throws {Error} If refresh token is invalid
 */
const refreshAccessToken = async (refreshTokenString) => {
  // console.log(
  //   "🔄 Bắt đầu làm mới access token với refreshToken:",
  //   refreshTokenString
  // );

  const refreshToken = await refreshTokenService.findValidRefreshToken(
    refreshTokenString
  );
  // console.log("🔍 Kết quả tìm refreshToken:", refreshToken);

  if (!refreshToken) {
    // console.log("❌ Không tìm thấy refresh token hoặc đã hết hạn.");
    throw new Error("Refresh token không hợp lệ");
  }

  const tokenData = jwtService.generateAccessToken(refreshToken.user_id);
  // console.log("✅ Tạo access token mới:", tokenData);

  await refreshTokenService.deleteRefreshToken(refreshToken);
  // console.log("🗑️ Đã xóa refresh token cũ");

  const newRefreshToken = await refreshTokenService.createRefreshToken(
    refreshToken.user_id
  );
  // console.log("🔁 Tạo refresh token mới:", newRefreshToken);

  return {
    ...tokenData,
    refresh_token: newRefreshToken.token,
  };
};

const forgotPassword = async (email) => {
  try {
    const { dataValues: user } = await User.findOne({ where: { email } });
    const userId = user.id;
    if (!user) {
      throw new Error("Thông tin không hợp lệ.");
    }
    queue.dispatch("sendVerifyEmailJob", { userId, type: "forgot-password" });
  } catch (err) {
    console.log(err);
  }
};

const logout = async (refreshToken) => {
  const deleted = await refreshTokenService.deleteRefreshToken(refreshToken);
  return deleted > 0;
};
module.exports = {
  register,
  login,
  refreshAccessToken,
  verify,
  resetPassword,
  forgotPassword,
  logout,
};
