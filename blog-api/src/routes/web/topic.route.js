const express = require("express");
const topicController = require("@/controllers/web/topic.controller");

const router = express.Router();

router.get("/trending-topics", topicController.getTrendingTopics);
router.get("/topics", topicController.getAllTopics);

router.get("/topics/:slug", topicController.getTopicDetail);
router.get("/topics/:slug/posts", topicController.getTopicDetailWithPosts);

module.exports = router;
