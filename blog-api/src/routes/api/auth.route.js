const express = require("express");
const authController = require("@/controllers/api/auth.controller");
const checkAuth = require("@/middlewares/checkAuth");
const authJWT = require("@/middlewares/authJWT");

const router = express.Router();

router.get("/me", checkAuth, authController.me);
router.post("/register", authController.register);
router.post("/refresh-token", authController.refreshToken);
router.post("/login", authController.login);
router.post("/verify", authController.verify);
router.post("/2fa/generate", authJWT, authController.generateSecret);
router.post("/2fa/confirm", authJWT, authController.confirm2FASetup);
router.post("/2fa/verify", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password", authJWT, authController.resetPasswordLoggedIn);
router.post("/forgot-password", authController.sendForgotEmail);
router.post("/logout", authController.logout);

module.exports = router;
