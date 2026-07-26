import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schema";

// Cookie options for refresh token — httpOnly so JS can't read it (XSS protection).
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = registerSchema.parse(req.body);
      const result = await authService.register(input);
      res.status(201).json({
        success: true,
        message: "Registered successfully. Please check your email for the verification code.",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const input = verifyOtpSchema.parse(req.body);
      const { accessToken, refreshToken } = await authService.verifyOtp(input);
      res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
      res.status(200).json({ success: true, message: "Email verified successfully.", data: { accessToken } });
    } catch (err) {
      next(err);
    }
  },

  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await authService.resendOtp(email);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = loginSchema.parse(req.body);
      const { accessToken, refreshToken } = await authService.login(input);
      res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
      res.status(200).json({ success: true, message: "Logged in successfully.", data: { accessToken } });
    } catch (err) {
      next(err);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const input = forgotPasswordSchema.parse(req.body);
      const result = await authService.forgotPassword(input);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const input = resetPasswordSchema.parse(req.body);
      const result = await authService.resetPassword(input);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, avatarUrl } = req.body;
      const { accessToken, refreshToken } = await authService.googleAuth({ email, name, avatarUrl });
      res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
      res.status(200).json({ success: true, message: "Logged in with Google.", data: { accessToken } });
    } catch (err) {
      next(err);
    }
  },

  logout(_req: Request, res: Response) {
    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
    res.status(200).json({ success: true, message: "Logged out successfully." });
  },
};
