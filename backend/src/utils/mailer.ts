import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

export async function sendMail(to: string, subject: string, html: string) {
  // In local dev without SMTP creds configured, don't crash the whole request —
  // log the email instead so auth flows are still testable during the hackathon.
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.log(`[DEV EMAIL] To: ${to} | Subject: ${subject}\n${html}`);
    return;
  }

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export function otpEmailTemplate(name: string, otp: string) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color: #ea580c;">Verify your email</h2>
      <p>Hi ${name},</p>
      <p>Your verification code is:</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${otp}</div>
      <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
    </div>
  `;
}

export function passwordResetEmailTemplate(name: string, otp: string) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color: #ea580c;">Reset your password</h2>
      <p>Hi ${name},</p>
      <p>Use this code to reset your password:</p>
      <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${otp}</div>
      <p>This code expires in 10 minutes. If you didn't request this, please secure your account.</p>
    </div>
  `;
}
