const express = require("express");
const router = express.Router();
const MessageController = require("@/controllers/web/message.controller");
const authJWT = require("@/middlewares/authJWT");

router.post("/", authJWT, MessageController.createMessage);
router.post(
  "/conversation",
  authJWT,
  MessageController.getOrCreateConversation
);
router.get("/:conversationId", authJWT, MessageController.getMessages);
router.post("/:conversationId/read", authJWT, MessageController.markAsRead);

module.exports = router;
