const express = require("express");
const router = express.Router();
const postController = require("@/controllers/web/post.controller");
const authJWT = require("@/middlewares/authJWT");

router.get("/my-posts", authJWT, postController.getPostsByCurrentUser);

router.get("/status", postController.getPostsByStatus);
router.get("/posts/topic/:slug", postController.getPostsByTopic);

module.exports = router;
