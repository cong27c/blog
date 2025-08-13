const express = require("express");
const likeController = require("@/controllers/web/like.controller");
const authJWT = require("@/middlewares/authJWT");

const router = express.Router();

router.get("/posts/:id/likes", authJWT, likeController.getPostLikes);
router.post("/posts/:id/likes", authJWT, likeController.togglePostLike);

module.exports = router;
