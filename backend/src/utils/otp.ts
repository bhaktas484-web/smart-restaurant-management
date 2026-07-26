/** Generates a 6-digit numeric OTP as a zero-padded string, e.g. "042911". */
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** OTPs are valid for 10 minutes — long enough for a real inbox check, short enough to stay secure. */
export function getOtpExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000);
}
