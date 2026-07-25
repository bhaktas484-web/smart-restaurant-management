"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { data } = await apiClient.post("/auth/login", values);
      return data;
    },
    onSuccess: (data) => {
      // Backend returns { data: { accessToken } }. The user profile would
      // normally come from a /auth/me call right after — kept minimal here.
      setSession(
        { id: "", name: "", email: "", role: "CUSTOMER" },
        data.data.accessToken
      );
      router.push("/dashboard");
    },
  });

  const onSubmit = (values: LoginFormValues) => loginMutation.mutate(values);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-charcoal">Welcome back</h1>
      <p className="mt-2 text-sm text-slate">Log in to manage your restaurant.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@restaurant.com"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs font-semibold text-primary">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
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

        {loginMutation.isError && (
          <p className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
            {(loginMutation.error as any)?.response?.data?.message ?? "Something went wrong. Try again."}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : "Log in"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <hr className="flex-1 border-charcoal/10" />
        <span className="text-xs text-slate-light">OR</span>
        <hr className="flex-1 border-charcoal/10" />
      </div>

      <Button variant="secondary" className="w-full">
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </Button>

      <p className="mt-8 text-center text-sm text-slate">
        Don't have an account?{" "}
        <Link href="/register" className="font-semibold text-primary">
          Start free trial
        </Link>
      </p>
    </div>
  );
}