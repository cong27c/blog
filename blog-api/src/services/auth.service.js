const { User, UserSetting } = require("@/models/index");
const { hash, compare } = require("@/utils/bcrypt");
const jwtService = require("./jwt.service");
const refreshTokenService = require("./refreshToken.service");
const transporter = require("@/config/mailer");
const { MAIL_SECRET, MAIL_EXPIRES_IN } = require("@/config/auth");
const { where } = require("sequelize");
const loadEmailTemplate = require("@/utils/loadEmailTemplate");
const queue = require("@/utils/queue");
const throwError = require("@/utils/throwError");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

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
    await UserSetting.create({ user_id: user.id });

    if (!user.verified_at) {
      return {
        message:
          "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
      };
    }
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
const confirm2FASetup = async (userId, otp) => {
  try {
    const userSetting = await UserSetting.findOne({
      where: { user_id: userId },
    });
    if (!userSetting) throw new Error("Không tìm thấy cài đặt user");

    const verified = speakeasy.totp.verify({
      secret: userSetting.two_factor_secret,
      encoding: "base32",
      token: otp,
      window: 1,
    });
    console.log(verified);

    if (!verified) throw new Error("OTP không hợp lệ.");

    await UserSetting.update(
      { two_factor_enabled: true },
      { where: { user_id: userId } }
    );

    return { success: true, message: "Đã bật 2FA thành công" };
  } catch (error) {
    console.log(error);
  }
};

const generate2FASecret = async (userId) => {
  try {
    const secret = speakeasy.generateSecret({
      name: "MyApp (2FA)",
    });
    console.log(secret.base32);
    console.log(userId);

    await UserSetting.update(
      {
        two_factor_secret: secret.base32,
        two_factor_enabled: false,
      },
      { where: { user_id: userId } }
    );

    const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url);

    return {
      secret: secret.base32,
      qrCode: qrCodeDataURL,
    };
  } catch (error) {
    console.log(error);
  }
};

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  const userSetting = await UserSetting.findOne({
    where: { user_id: user.id },
  });
  if (!user) throw new Error("Thông tin đăng nhập không hợp lệ.");
  if (!user.verified_at) throwError("Email chưa xác thực");

  const isValid = await compare(password, user.dataValues.password);
  if (!isValid) throw new Error("Thông tin đăng nhập không hợp lệ.");

  // Nếu user chưa bật 2FA → cấp token như bình thường
  if (!userSetting.two_factor_enabled) {
    const tokenData = jwtService.generateAccessToken(user.dataValues.id);
    const refreshToken = await refreshTokenService.createRefreshToken(
      user.dataValues.id
    );

    return {
      ...tokenData,
      refresh_token: refreshToken.token,
    };
  }

  // Nếu user đã bật 2FA → yêu cầu nhập OTP
  return {
    require2FA: true,
    user_id: user.id, // FE dùng để gọi verify OTP
    message: "Vui lòng nhập mã OTP từ Google Authenticator",
  };
};

const verifyLoginOtp = async (userId, otp) => {
  try {
    const user = await User.findOne({ where: { id: userId } });
    const userSetting = await UserSetting.findOne({
      where: { user_id: user.id },
    });
    if (!user) throw new Error("Người dùng không tồn tại.");
    const verified = speakeasy.totp.verify({
      secret: userSetting.two_factor_secret,
      encoding: "base32",
      token: otp,
      window: 1,
    });

    if (!verified) {
      throw new Error("OTP không hợp lệ.");
    }

    // OTP đúng → cấp JWT và refresh token
    const tokenData = jwtService.generateAccessToken(user.dataValues.id);
    const refreshToken = await refreshTokenService.createRefreshToken(
      user.dataValues.id
    );

    return {
      ...tokenData,
      refresh_token: refreshToken.token,
    };
  } catch (error) {
    console.log(error);
  }
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

const resetPasswordLoggedIn = async (userId, currentPassword, newPassword) => {
  console.log("currentPassword : ", currentPassword);
  console.log("newPassword : ", newPassword);
  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  // check current password
  const isMatch = await compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  // hash new password
  const hashNewPassword = await hash(newPassword);

  await User.update({ password: hashNewPassword }, { where: { id: userId } });

  return true;
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
  resetPasswordLoggedIn,
  confirm2FASetup,
  register,
  login,
  refreshAccessToken,
  verify,
  resetPassword,
  forgotPassword,
  logout,
  verifyLoginOtp,
  generate2FASecret,
};
