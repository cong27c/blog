const express = require("express");
const router = express.Router();
const profileController = require("@/controllers/web/profile.controller");
const authJWT = require("@/middlewares/authJWT");

router.get("/:username", authJWT, profileController.getProfile);
router.get("/user/:username", profileController.getPostsByCurrentUser);
router.put("/:username/edit", profileController.updateProfile);

module.exports = router;
