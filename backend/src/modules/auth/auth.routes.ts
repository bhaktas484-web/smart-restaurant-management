import { Router } from "express";
import rateLimit from "express-rate-limit";
import { authController } from "./auth.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();

// Login/register are prime brute-force targets — tighter limit than the global one.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again in 15 minutes." },
});

router.post("/register", authLimiter, authController.register);
router.post("/verify-otp", authLimiter, authController.verifyOtp);
router.post("/resend-otp", authLimiter, authController.resendOtp);
router.post("/login", authLimiter, authController.login);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/reset-password", authLimiter, authController.resetPassword);
router.post("/google", authLimiter, authController.googleAuth);
router.post("/logout", authMiddleware, authController.logout);

export default router;
