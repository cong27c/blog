const response = require("@/utils/response");
const authService = require("@/services/auth.service");

const register = async (req, res) => {
  try {
    const tokenData = await authService.register(req.body, res);

    response.success(res, 200, tokenData);
  } catch (error) {
    response.error(res, 401, error.message);
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
  logout,
  register,
  login,
  me,
  refreshToken,
  verify,
  sendForgotEmail,
  resetPassword,
};
