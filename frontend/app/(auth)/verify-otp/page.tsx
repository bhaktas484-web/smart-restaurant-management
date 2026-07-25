"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { otpSchema, type OtpFormValues } from "@/schemas/auth.schema";

const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const setSession = useAuthStore((s) => s.setSession);

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { handleSubmit, setValue, formState: { errors } } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
  });

  const verifyMutation = useMutation({
    mutationFn: async (values: OtpFormValues) => {
      const { data } = await apiClient.post("/auth/verify-otp", { email, otp: values.otp });
      return data;
    },
    onSuccess: (data) => {
      setSession({ id: "", name: "", email, role: "CUSTOMER" }, data.data.accessToken);
      router.push("/dashboard");
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => apiClient.post("/auth/resend-otp", { email }),
  });

  function handleDigitChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return; // digits only
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    setValue("otp", next.join(""));

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  const onSubmit = (values: OtpFormValues) => verifyMutation.mutate(values);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-charcoal">Check your email</h1>
      <p className="mt-2 text-sm text-slate">
        We sent a 6-digit code to <span className="font-semibold text-charcoal">{email || "your email"}</span>.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
        <div className="flex justify-between gap-2">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              inputMode="numeric"
              maxLength={1}
              className="h-14 w-12 rounded-xl border border-charcoal/10 bg-white text-center font-display text-xl font-semibold text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          ))}
        </div>
        {errors.otp && <p className="mt-2 text-xs text-danger">{errors.otp.message}</p>}

        {verifyMutation.isError && (
          <p className="mt-4 rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
            {(verifyMutation.error as any)?.response?.data?.message ?? "Invalid or expired code."}
          </p>
        )}

        <Button type="submit" className="mt-6 w-full" disabled={verifyMutation.isPending}>
          {verifyMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : "Verify email"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate">
        Didn't get a code?{" "}
        <button
          onClick={() => resendMutation.mutate()}
          disabled={resendMutation.isPending}
          className="font-semibold text-primary disabled:opacity-50"
        >
          {resendMutation.isPending ? "Sending..." : resendMutation.isSuccess ? "Sent!" : "Resend code"}
        </button>
      </p>
    </div>
  );
}