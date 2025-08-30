// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("@/controllers/web/notification.controller");
const authJWT = require("@/middlewares/authJWT");

// GET all
router.get("/", authJWT, notificationController.getNotifications);

// POST create
router.post("/", authJWT, notificationController.createNotification);

// PATCH mark as read
router.patch("/:id/read", authJWT, notificationController.markAsRead);

// PATCH mark all as read
router.patch("/mark-all", authJWT, notificationController.markAllAsRead);

// DELETE
router.delete("/:id", authJWT, notificationController.deleteNotification);

module.exports = router;
