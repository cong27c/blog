const express = require("express");
const router = express.Router();
const commentController = require("@/controllers/web/comment.controller");
const authJWT = require("@/middlewares/authJWT");
const optionalAuthMiddleware = require("@/middlewares/optionalAuthMiddleware");

router.post("/", authJWT, commentController.create);
router.put("/:id", authJWT, commentController.update);
router.delete("/:id", authJWT, commentController.remove);
router.post("/:comment_id/like", authJWT, commentController.toggleLike);
router.post("/reply", authJWT, commentController.replyToComment);
router.get("/user/:user_id", commentController.getByUser);
router.get(
  "/posts/:slug",
  optionalAuthMiddleware,
  commentController.getCommentsByPost
);

module.exports = router;
