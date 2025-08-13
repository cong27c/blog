const express = require("express");
const router = express.Router({ mergeParams: true });

const homeRoute = require("./home.route");
const likeRoute = require("./like.route");
const bookmarkRoute = require("./bookmark.route");
const topicRoute = require("./topic.route");
const postRoute = require("./post.route");
const followRoute = require("./follow.route");
const blogRoute = require("./blog.route");
const uploadRoute = require("./upload.route");
const commentRoute = require("./comment.route");
const profileRoute = require("./profile.route");

router.use("/", homeRoute);
router.use("/", likeRoute);
router.use("/", bookmarkRoute);
router.use("/", topicRoute);
router.use("/", postRoute);
router.use("/", followRoute);
router.use("/profile", profileRoute);
router.use("/comments", commentRoute);
router.use("/uploads", uploadRoute);
router.use("/blog", blogRoute);

module.exports = router;
