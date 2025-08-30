import * as httpRequest from "@/utils/httpRequest";

export const register = async (data) => {
  const response = await httpRequest.post("/api/v1/auth/register", data, {
    withCredentials: true, // ĐỂ GỬI COOKIE refresh_token
  });
  localStorage.setItem("access_token", response.data.access_token);

  return response.data;
};

export const getSettings = async () => {
  try {
    const res = await httpRequest.get(`/settings`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAuthorSettings = async () => {
  try {
    const res = await httpRequest.get(`/settings/author`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateSettings = async (data) => {
  try {
    const res = await httpRequest.put(`/settings`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (data) => {
  const response = await httpRequest.post("/api/v1/auth/login", data, {
    withCredentials: true,
  });

  localStorage.setItem("access_token", response.data.access_token);

  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await httpRequest.post("/api/v1/auth/forgot-password", data);

  return response.data;
};

export const resetPassword = async (data) => {
  const response = await httpRequest.post("/api/v1/auth/reset-password", data);

  return response.data;
};

export const changePassword = async (data) => {
  const response = await httpRequest.post("/api/v1/auth/change-password", data);

  return response.data;
};

export const logout = async () => {
  const response = await httpRequest.post("/api/v1/auth/logout");

  return response.data;
};

export const generate2FASecret = async () => {
  try {
    const res = await httpRequest.post("/api/v1/auth/2fa/generate");
    return res.data;
  } catch (err) {
    console.error("generate2FASecret error:", err);
    throw err.response?.data || { message: "Lỗi khi generate 2FA secret" };
  }
};

export const confirm2FASetup = async (otp) => {
  try {
    const res = await httpRequest.post("/api/v1/auth/2fa/confirm", { otp });
    return res.data;
  } catch (err) {
    console.error("confirm2FASetup error:", err);
    throw err.response?.data || { message: "OTP không hợp lệ" };
  }
};

export const verifyLoginOtp = async (userId, otp) => {
  try {
    const res = await httpRequest.post("/api/v1/auth/2fa/verify", {
      userId,
      otp,
    });
    return res.data;
  } catch (err) {
    console.error("verifyLoginOtp error:", err);
    throw err.response?.data || { message: "OTP không hợp lệ" };
  }
};

export const updateEmail = async (email) => {
  try {
    const res = await httpRequest.put("/settings/email", { email });
    return res.data;
  } catch (err) {
    console.error("confirm2FASetup error:", err);
    throw err.response?.data || { message: "OTP không hợp lệ" };
  }
};

export const exportData = async (email) => {
  try {
    const res = await httpRequest.get("/settings/export-data", { email });
    return res.data;
  } catch (err) {
    console.error("confirm2FASetup error:", err);
    throw err.response?.data || { message: "OTP không hợp lệ" };
  }
};
export default {
  updateEmail,
  generate2FASecret,
  confirm2FASetup,
  verifyLoginOtp,
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
};
