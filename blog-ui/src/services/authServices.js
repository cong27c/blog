import * as httpRequest from "@/utils/httpRequest";

export const register = async (data) => {
  const response = await httpRequest.post("/api/v1/auth/register", data, {
    withCredentials: true, // ĐỂ GỬI COOKIE refresh_token
  });
  localStorage.setItem("access_token", response.data.access_token);

  return response.data;
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

export const logout = async () => {
  const response = await httpRequest.post("/api/v1/auth/logout");

  return response.data;
};

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  logout,
};
