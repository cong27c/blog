import authServices from "@/services/authServices";
import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/v1/auth/me");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await authServices.register(payload);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authServices.login(payload);
      return response;
    } catch (error) {
      console.error("Login error detail:", error);
      return rejectWithValue(error || "Đăng nhập thất bại");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authServices.forgotPassword(payload);
      return response;
    } catch (error) {
      console.error("forgotPassword thất bại:", error);
      return rejectWithValue(error || "thao tác thất bại");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authServices.resetPassword(payload);
      return response;
    } catch (error) {
      console.error("resetPassword thất bại:", error);
      return rejectWithValue(error || "resetPassword thất bại");
    }
  }
);

export const logoutAsync = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      const data = await authServices.logout();
      return data;
    } catch (error) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
