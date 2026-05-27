"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  activeIcon?: LucideIcon;
}

interface SidebarProps {
  items: NavItem[];
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export function Sidebar({ items, user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 fixed inset-y-0 left-0 bg-bg-card border-r border-border z-40">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-subtle bg-accent-primary" />
            <span className="text-xl font-serif font-bold tracking-tight">Proe</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-card transition-colors relative group",
                  isActive
                    ? "bg-accent-primary/5 text-accent-primary"
                    : "text-text-secondary hover:bg-bg-secondary hover:text-text-primary"
                )}
              >
                {isActive && (
                  <span className="absolute left-0 w-1 h-5 bg-accent-primary rounded-r-full" />
                )}
                <Icon className={cn("h-5 w-5", isActive ? "text-accent-primary" : "text-text-muted group-hover:text-text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-accent-secondary flex items-center justify-center text-white text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                <p className="text-xs text-text-muted truncate capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-card border-t border-border flex items-center justify-around px-2 z-40">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive && item.activeIcon ? item.activeIcon : item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive ? "text-accent-primary" : "text-text-muted"
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
