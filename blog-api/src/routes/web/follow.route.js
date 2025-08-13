const express = require("express");
const router = express.Router();
const followController = require("@/controllers/web/follow.controller");
const authJWT = require("@/middlewares/authJWT");

router.post("/follow", authJWT, followController.follow);
router.post("/unfollow", authJWT, followController.unfollow);
router.get("/followers/:userId", followController.followers);
router.get("/following/:userId", followController.following);
router.get(
  "/is-following/:followedId",
  authJWT,
  followController.checkFollowing
);

module.exports = router;
