import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "accent" | "secondary";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-bg-secondary text-text-secondary": variant === "default",
          "bg-success/10 text-success": variant === "success",
          "bg-warning/10 text-warning": variant === "warning",
          "bg-error/10 text-error": variant === "error",
          "bg-accent-primary/10 text-accent-primary": variant === "accent",
          "bg-accent-secondary/10 text-accent-secondary": variant === "secondary",
        },
        className
      )}
    >
      {children}
    </span>
  );
}