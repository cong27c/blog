const response = require("@/utils/response");
const authService = require("@/services/auth.service");
const throwError = require("@/utils/throwError");

const register = async (req, res) => {
  try {
    const tokenData = await authService.register(req.body, res);

    response.success(res, 200, tokenData);
  } catch (error) {
    response.error(res, 401, error.message);
  }
};

const generateSecret = async (req, res) => {
  try {
    const userId = req.user.id; // giả sử bạn có middleware auth gán req.user
    const result = await authService.generate2FASecret(userId);
    const qrCode = result.qrCode;
    response.success(res, 200, qrCode);
  } catch (error) {
    console.log(error);
    response.error(res, 500, error.message);
  }
};

const confirm2FASetup = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otp } = req.body;

    if (!otp) {
      throwError("Vui lòng nhập OTP");
    }

    const result = await authService.confirm2FASetup(userId, otp);
    response.success(res, 200, result);
  } catch (error) {
    console.log(error);
    response.error(res, 400, error.message);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const result = await authService.verifyLoginOtp(userId, otp);
    response.success(res, 200, result);
  } catch (error) {
    console.log(error);
    response.error(res, 400, error.message);
  }
};

const login = async (req, res) => {
  try {
    const tokenData = await authService.login(
      req.body.email,
      req.body.password
    );
    res.cookie("refresh_token", tokenData.refresh_token, {
      httpOnly: true,
      secure: false, // HTTPS
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      path: "/",
    });
    delete tokenData.refresh_token;

    response.success(res, 200, tokenData);
  } catch (error) {
    response.error(res, 401, error.message);
  }
};

const me = async (req, res) => {
  try {
    const user = req.user;
    response.success(res, 200, user);
  } catch (error) {
    console.log(error);
  }
};

const verify = async (req, res) => {
  try {
    authService.verify(req.query.token);
    res.status(200).send("");
  } catch (error) {
    throw new Error(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, token } = req.body;
    if (!token) {
      return response.error(res, 400, "Token không được để trống");
    }
    authService.resetPassword(token, password);

    res.status(200).send("");
  } catch (error) {
    throw new Error(error);
  }
};

const resetPasswordLoggedIn = async (req, res) => {
  try {
    const userId = req.user.id; // từ authJWT middleware
    const { currentPassword, newPassword } = req.body;

    const success = await authService.resetPasswordLoggedIn(
      userId,
      currentPassword,
      newPassword
    );

    if (!success) {
      return response.error(res, 400, "Current password is incorrect");
    }
    return response.success(res, 200, { success: true });
  } catch (error) {
    console.error(error);
    return response.error(res, 400, error.message);
  }
};

const sendForgotEmail = async (req, res) => {
  try {
    authService.forgotPassword(req.body.email);
    res.status(200).send("");
  } catch (error) {
    throw new Error(error);
  }
};

const refreshToken = async (req, res) => {
  try {
    // LẤY refresh_token TỪ COOKIE
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      return response.error(res, 401, "Refresh token is missing");
    }

    const tokenData = await authService.refreshAccessToken(refreshToken);

    // 🛠️ Set lại cookie mới
    res.cookie("refresh_token", tokenData.refresh_token, {
      httpOnly: true,
      secure: false, // hoặc true nếu dùng HTTPS
      sameSite: "Lax",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 ngày
      path: "/",
    });

    // Xoá refresh_token khỏi response trả về (nếu không muốn expose)
    delete tokenData.refresh_token;

    return response.success(res, 200, tokenData);
  } catch (error) {
    console.log(error);
    return response.error(res, 401, error.message);
  }
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) return response.error(res, 400, "Refresh token required");
  try {
    const success = await authService.logout(refreshToken);
    if (!success) return response.error(res, 400, "Invalid refresh token");
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: false, // nếu bạn dùng https
      sameSite: "Strict",
    });
    return response.success(res, 201);
  } catch (error) {
    console.log(error);
    return response.error(res, 500, "Internal server error");
  }
};

module.exports = {
  resetPasswordLoggedIn,
  generateSecret,
  verifyOtp,
  logout,
  register,
  login,
  me,
  refreshToken,
  verify,
  sendForgotEmail,
  resetPassword,
  confirm2FASetup,
};
