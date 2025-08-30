const express = require("express");
const router = express.Router({ mergeParams: true });

const homeRoute = require("./home.route");
const likeRoute = require("./like.route");
const bookmarkRoute = require("./bookmark.route");
const topicRoute = require("./topic.route");
const postRoute = require("./post.route");
const followRoute = require("./follow.route");
const messageRoute = require("./message.route");
const conversationsRoute = require("./conversation.route");
const blogRoute = require("./blog.route");
const uploadRoute = require("./upload.route");
const commentRoute = require("./comment.route");
const profileRoute = require("./profile.route");
const notificationRoute = require("./notification.route");
const settingRoute = require("./setting.route");

router.use("/", homeRoute);
router.use("/", likeRoute);
router.use("/", bookmarkRoute);
router.use("/", topicRoute);
router.use("/", postRoute);
router.use("/", followRoute);
router.use("/settings", settingRoute);
router.use("/notifications", notificationRoute);
router.use("/conversations", conversationsRoute);
router.use("/messages", messageRoute);
router.use("/profile", profileRoute);
router.use("/comments", commentRoute);
router.use("/uploads", uploadRoute);
router.use("/blog", blogRoute);

module.exports = router;
