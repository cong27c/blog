// src/utils/httpRequest.js
import axiosInstance from "@/utils/axiosInstance";

export const get = (url, config = {}) => axiosInstance.get(url, config);
export const post = (url, data, config = {}) =>
  axiosInstance.post(url, data, config);
export const put = (url, data, config = {}) =>
  axiosInstance.put(url, data, config);
export const patch = (url, data, config = {}) =>
  axiosInstance.patch(url, data, config);
export const del = (url, config = {}) => axiosInstance.delete(url, config);

export default {
  get,
  post,
  put,
  patch,
  del,
};
