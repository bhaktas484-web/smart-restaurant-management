import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "solid" | "glass" | "glass-dark";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "solid", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl p-6",
        variant === "solid" && "bg-white shadow-soft border border-charcoal/5",
        variant === "glass" && "glass-card",
        variant === "glass-dark" && "glass-card-dark text-white",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4 flex flex-col gap-1", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-display text-xl font-semibold", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn(className)} {...props} />
);
CardContent.displayName = "CardContent";