"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordFormValues,
  type ResetPasswordFormValues,
} from "@/schemas/password-reset.schema";

type Step = "request" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- Step 1: request a reset code ---
  const requestForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const requestMutation = useMutation({
    mutationFn: async (values: ForgotPasswordFormValues) => {
      const { data } = await apiClient.post("/auth/forgot-password", values);
      return data;
    },
    onSuccess: (_data, variables) => {
      setEmail(variables.email);
      setStep("reset");
    },
  });

  // --- Step 2: submit code + new password ---
  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const resetMutation = useMutation({
    mutationFn: async (values: ResetPasswordFormValues) => {
      const { data } = await apiClient.post("/auth/reset-password", {
        email,
        otp: values.otp,
        newPassword: values.newPassword,
      });
      return data;
    },
    onSuccess: () => {
      router.push("/login");
    },
  });

  if (step === "request") {
    return (
      <div>
        <h1 className="font-display text-3xl font-semibold text-charcoal">Forgot your password?</h1>
        <p className="mt-2 text-sm text-slate">
          Enter your email and we'll send you a code to reset it.
        </p>

        <form
          onSubmit={requestForm.handleSubmit((v) => requestMutation.mutate(v))}
          className="mt-8 space-y-5"
        >
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@restaurant.com"
              error={requestForm.formState.errors.email?.message}
              {...requestForm.register("email")}
            />
          </div>

          {requestMutation.isError && (
            <p className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
              {(requestMutation.error as any)?.response?.data?.message ?? "Something went wrong. Try again."}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={requestMutation.isPending}>
            {requestMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : "Send reset code"}
          </Button>
        </form>

        <Link href="/login" className="mt-8 flex items-center justify-center gap-1.5 text-sm font-semibold text-charcoal">
          <ArrowLeft size={14} /> Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-charcoal">Reset your password</h1>
      <p className="mt-2 text-sm text-slate">
        Enter the code sent to <span className="font-semibold text-charcoal">{email}</span> and choose a new password.
      </p>

      <form onSubmit={resetForm.handleSubmit((v) => resetMutation.mutate(v))} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="otp">Reset code</Label>
          <Input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            error={resetForm.formState.errors.otp?.message}
            {...resetForm.register("otp")}
          />
        </div>

        <div>
          <Label htmlFor="newPassword">New password</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
              error={resetForm.formState.errors.newPassword?.message}
              {...resetForm.register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-light"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter new password"
            error={resetForm.formState.errors.confirmPassword?.message}
            {...resetForm.register("confirmPassword")}
          />
        </div>

        {resetMutation.isError && (
          <p className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
            {(resetMutation.error as any)?.response?.data?.message ?? "Invalid or expired code."}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={resetMutation.isPending}>
          {resetMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : "Reset password"}
        </Button>
      </form>

      <button
        onClick={() => setStep("request")}
        className="mt-6 flex w-full items-center justify-center gap-1.5 text-sm font-semibold text-charcoal"
      >
        <ArrowLeft size={14} /> Use a different email
      </button>
    </div>
  );
}