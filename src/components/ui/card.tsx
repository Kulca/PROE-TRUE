"use client";
import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export function Card({ className, children, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-bg-card border border-border rounded shadow-card",
        hover && "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}