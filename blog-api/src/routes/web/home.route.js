const express = require("express");
const homeController = require("@/controllers/web/home.controller");

const router = express.Router();

router.get("/posts/featured", homeController.getFeaturedPostsController);
router.get("/posts/latest", homeController.getLatestPostsController);

module.exports = router;
