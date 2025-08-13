const express = require("express");
const topicsController = require("@/controllers/api/topic.controller");

const router = express.Router();

router.get("/", topicsController.index);
router.get("/:topic_name", topicsController.show);
router.post("/", topicsController.store);
router.put("/:topic_name", topicsController.update);
router.patch("/:topic_name", topicsController.update);
router.delete("/:topic_name", topicsController.destroy);

module.exports = router;
