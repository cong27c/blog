const express = require("express");
const homeController = require("@/controllers/web/home.controller");
const authJWT = require("@/middlewares/authJWT");

const router = express.Router();

router.get(
  "/posts/featured",
  authJWT,
  homeController.getFeaturedPostsController
);
router.get("/posts/latest", authJWT, homeController.getLatestPostsController);

module.exports = router;
