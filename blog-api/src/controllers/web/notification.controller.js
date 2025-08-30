// controllers/notificationController.js
const notificationService = require("@/services/notification.service");
const response = require("@/utils/response");

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const data = await notificationService.getNotifications(
      userId,
      parseInt(limit),
      offset
    );
    response.success(res, 200, data);
  } catch (error) {
    console.error(error);
    response.error(res, 500, error.message);
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { user_id, post_id, type, title, notifiable_type, notifiable_id } =
      req.body;

    const notification = await notificationService.createNotification({
      user_id,
      post_id,
      type,
      title,
      notifiable_type,
      notifiable_id,
    });
    response.success(res, 201, notification);
  } catch (error) {
    console.error(error);
    response.error(res, 500, error.message);
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const notification = await notificationService.markAsRead(userId, id);
    response.success(res, 201, notification);
  } catch (error) {
    console.error(error);
    response.error(res, 500, error.message);
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    await notificationService.markAllAsRead(userId);
    response.success(res, 201);
  } catch (error) {
    console.error(error);
    response.error(res, 500, error.message);
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    await notificationService.deleteNotification(userId, id);
    response.success(res, 201);
  } catch (error) {
    console.error(error);
    response.error(res, 500, error.message);
  }
};
