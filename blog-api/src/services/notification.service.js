// services/notificationService.js
const { Notification } = require("../models");

async function getNotifications(userId, limit = 20, offset = 0) {
  const { rows, count } = await Notification.findAndCountAll({
    where: { user_id: userId, read: false },
    order: [["created_at", "DESC"]],
    limit,
    offset,
  });

  const unreadCount = await Notification.count({
    where: { user_id: userId, read: false },
  });

  return { notifications: rows, unreadCount, total: count };
}

async function createNotification({
  userId,
  type,
  title,
  link,
  notifiableType,
  notifiableId,
}) {
  return await Notification.create({
    user_id: userId,
    type,
    title,
    link,
    notifiable_type: notifiableType,
    notifiable_id: notifiableId,
    read: false,
  });
}

async function markAsRead(userId, notificationId) {
  const notification = await Notification.findOne({
    where: { id: notificationId, user_id: userId },
  });

  if (!notification) throw new Error("Notification not found");

  notification.read = true;
  await notification.save();

  return notification;
}

async function markAllAsRead(userId) {
  await Notification.update(
    { read: true },
    { where: { user_id: userId, read: false } }
  );
  return true;
}

async function deleteNotification(userId, notificationId) {
  const notification = await Notification.findOne({
    where: { id: notificationId, user_id: userId },
  });

  if (!notification) throw new Error("Notification not found");

  await notification.destroy();
  return true;
}

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
