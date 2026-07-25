import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border bg-white px-4 py-3 text-sm text-charcoal placeholder:text-slate-light",
          "transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50",
          error ? "border-danger" : "border-charcoal/10",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";