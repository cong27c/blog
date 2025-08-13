const express = require("express");
const blogController = require("@/controllers/web/blog.controller");

const router = express.Router();

router.get("/:slug", blogController.getBlogDetail);
router.get("/related/posts", blogController.getRelatedPosts);
router.post("/posts/:id/view", blogController.incrementView);

module.exports = router;
