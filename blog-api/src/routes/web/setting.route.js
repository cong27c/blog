const express = require("express");
const router = express.Router();
const settingController = require("@/controllers/web/settings.controller");
const authJWT = require("@/middlewares/authJWT");

router.get("/", authJWT, settingController.getSettings);
router.get("/author", authJWT, settingController.getAuthorSettings);
router.put("/", authJWT, settingController.updateSettings);
router.put("/email", authJWT, settingController.updateEmail);
router.get("/email/verify", settingController.verifyUpdateEmail);
router.get("/export-data", authJWT, settingController.exportData);

module.exports = router;
