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
import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const registerMutation = useMutation({
    mutationFn: async (values: RegisterFormValues) => {
      const { data } = await apiClient.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      return data;
    },
    onSuccess: (_data, variables) => {
      // Backend sends the OTP by email at this point — route to verification
      // with the email in the query string so that page knows who to verify.
      router.push(`/verify-otp?email=${encodeURIComponent(variables.email)}`);
    },
  });

  const onSubmit = (values: RegisterFormValues) => registerMutation.mutate(values);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-charcoal">Start your free trial</h1>
      <p className="mt-2 text-sm text-slate">No credit card required. Set up in minutes.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Rhea Kapoor"
            error={errors.name?.message}
            {...register("name")}
          />
        </div>

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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 6 characters"
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

        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        {registerMutation.isError && (
          <p className="rounded-lg bg-danger/10 px-4 py-2.5 text-sm text-danger">
            {(registerMutation.error as any)?.response?.data?.message ?? "Something went wrong. Try again."}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : "Create account"}
        </Button>

        <p className="text-center text-xs text-slate-light">
          By continuing, you agree to Plateful's Terms of Service and Privacy Policy.
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-slate">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Log in
        </Link>
      </p>
    </div>
  );
}