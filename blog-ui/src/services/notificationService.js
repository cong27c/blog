// services/notificationService.js
import httpRequest from "@/utils/httpRequest";

// Lấy tất cả thông báo của user
export const getNotifications = async () => {
  try {
    const res = await httpRequest.get("/notifications");
    return res.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Tạo notification mới (ít khi dùng trực tiếp ở FE, thường do BE tự tạo)
export const createNotification = async (data) => {
  try {
    const res = await httpRequest.post("/notifications", data);
    return res.data;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Đánh dấu 1 notification là đã đọc
export const markAsRead = async (id) => {
  try {
    const res = await httpRequest.patch(`/notifications/${id}/read`);
    return res.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Đánh dấu tất cả là đã đọc
export const markAllAsRead = async () => {
  try {
    const res = await httpRequest.patch("/notifications/mark-all");
    return res.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// Xoá 1 notification
export const deleteNotification = async (id) => {
  try {
    const res = await httpRequest.delete(`/notifications/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};
