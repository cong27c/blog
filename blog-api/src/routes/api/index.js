const express = require("express");
const router = express.Router({ mergeParams: true });
const authJWT = require("@/middlewares/authJWT");

const authRouter = require("./auth.route");
const commentRouter = require("./comment.route");
const postRouter = require("./post.route");
const topicRouter = require("./topic.route");
const pusher = require("@/config/pusher");

router.use("/auth", authRouter);
router.use("/topics", topicRouter);
router.post("/pusher/auth", authJWT, (req, res) => {
  const socketId = req.body.socket_id;
  const channelName = req.body.channel_name;

  const userId = req.user?.id;
  if (!userId) {
    return res.status(403).send("Unauthorized");
  }

  const auth = pusher.authenticate(socketId, channelName);
  res.send(auth);
});

//Route cho posts và các thành phần con
router.use("/posts", postRouter);
router.use("/posts/:slug/comments", commentRouter);

module.exports = router;
