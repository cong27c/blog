const express = require("express");
const authController = require("@/controllers/api/auth.controller");
const checkAuth = require("@/middlewares/checkAuth");

const router = express.Router();

router.get("/me", checkAuth, authController.me);
router.post("/register", authController.register);
router.post("/refresh-token", authController.refreshToken);
router.post("/login", authController.login);
router.post("/verify", authController.verify);
router.post("/reset-password", authController.resetPassword);
router.post("/forgot-password", authController.sendForgotEmail);
router.post("/logout", authController.logout);

module.exports = router;
