"use client";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 rounded focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-accent-primary text-white hover:bg-orange-600 active:bg-orange-700": variant === "primary",
            "bg-white text-accent-primary border border-accent-primary hover:bg-orange-50": variant === "secondary",
            "text-accent-primary hover:underline bg-transparent border-none": variant === "ghost",
            "bg-error text-white hover:bg-red-600": variant === "danger",
          },
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-11 px-5 text-base": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
export { Button };