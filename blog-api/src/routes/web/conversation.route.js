// routes/conversation.routes.js
const express = require("express");
const router = express.Router();
const ConversationController = require("@/controllers/web/conversation.controller");
const authJWT = require("@/middlewares/authJWT");

router.get("/", authJWT, ConversationController.getUserConversations);
router.post("/", authJWT, ConversationController.createConversation);
router.post(
  "/:conversationId/chat",
  authJWT,
  ConversationController.chatMessage
);

module.exports = router;
