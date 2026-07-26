import bcrypt from "bcryptjs";
import { prisma } from "../../config/prisma";
import { AppError } from "../../middleware/error.middleware";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { generateOtp, getOtpExpiry } from "../../utils/otp";
import { sendMail, otpEmailTemplate, passwordResetEmailTemplate } from "../../utils/mailer";
import type {
  RegisterInput,
  LoginInput,
  VerifyOtpInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./auth.schema";

const SALT_ROUNDS = 10;

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new AppError("An account with this email already exists.", 409);
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
    const otp = generateOtp();

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        phone: input.phone,
        role: "CUSTOMER", // staff roles are assigned by a manager/admin later, never at self-signup
        otpCode: otp,
        otpExpiresAt: getOtpExpiry(),
      },
    });

    // Every customer gets a linked loyalty/CRM profile at signup.
    await prisma.customer.create({ data: { userId: user.id } });

    await sendMail(user.email, "Verify your email", otpEmailTemplate(user.name, otp));

    return { userId: user.id, email: user.email };
  },

  async verifyOtp(input: VerifyOtpInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new AppError("User not found.", 404);
    if (user.isVerified) throw new AppError("Account is already verified.", 400);

    if (!user.otpCode || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new AppError("OTP has expired. Please request a new one.", 400);
    }
    if (user.otpCode !== input.otp) {
      throw new AppError("Invalid OTP.", 400);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, otpCode: null, otpExpiresAt: null },
    });

    return this.issueTokens(user.id, user.role, user.restaurantId);
  },

  async resendOtp(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("User not found.", 404);
    if (user.isVerified) throw new AppError("Account is already verified.", 400);

    const otp = generateOtp();
    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: otp, otpExpiresAt: getOtpExpiry() },
    });

    await sendMail(user.email, "Your new verification code", otpEmailTemplate(user.name, otp));
    return { message: "OTP resent successfully." };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user || !user.passwordHash) {
      throw new AppError("Invalid email or password.", 401);
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isValid) {
      throw new AppError("Invalid email or password.", 401);
    }

    if (!user.isVerified) {
      throw new AppError("Please verify your email before logging in.", 403);
    }

    return this.issueTokens(user.id, user.role, user.restaurantId);
  },

  async forgotPassword(input: ForgotPasswordInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    // Deliberately don't reveal whether the email exists — prevents user enumeration.
    if (!user) return { message: "If an account exists, a reset code has been sent." };

    const otp = generateOtp();
    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: otp, otpExpiresAt: getOtpExpiry() },
    });

    await sendMail(user.email, "Reset your password", passwordResetEmailTemplate(user.name, otp));
    return { message: "If an account exists, a reset code has been sent." };
  },

  async resetPassword(input: ResetPasswordInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new AppError("Invalid request.", 400);

    if (!user.otpCode || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new AppError("Reset code has expired. Please request a new one.", 400);
    }
    if (user.otpCode !== input.otp) {
      throw new AppError("Invalid reset code.", 400);
    }

    const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, otpCode: null, otpExpiresAt: null },
    });

    return { message: "Password reset successfully." };
  },

  /**
   * Handles Google OAuth. Expects the frontend to already have exchanged the
   * Google ID token and verified it (via NextAuth/Better Auth) — here we just
   * upsert the user record. Kept simple for hackathon speed; in a fuller
   * build this would independently verify the token server-side too.
   */
  async googleAuth(profile: { email: string; name: string; avatarUrl?: string }) {
    let user = await prisma.user.findUnique({ where: { email: profile.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: profile.name,
          email: profile.email,
          avatarUrl: profile.avatarUrl,
          provider: "google",
          isVerified: true, // Google already verified the email
          role: "CUSTOMER",
        },
      });
      await prisma.customer.create({ data: { userId: user.id } });
    }

    return this.issueTokens(user.id, user.role, user.restaurantId);
  },

  issueTokens(userId: string, role: string, restaurantId?: string | null) {
    const payload = { userId, role: role as any, restaurantId };
    return {
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  },
};
