"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, FileText, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/brand/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/brand/campaigns", label: "Campaigns", icon: Package },
  { href: "/brand/waybills", label: "Waybills", icon: FileText },
  { href: "/brand/analytics", label: "Analytics", icon: BarChart3 },
];

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border bg-bg-card fixed h-full">
        <div className="px-6 py-5 border-b border-border">
          <Link href="/" className="font-serif text-2xl text-accent-secondary">Proe</Link>
          <p className="text-xs text-text-muted mt-0.5">Brand Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded transition-colors text-sm font-medium",
                  isActive ? "bg-accent-secondary/10 text-accent-secondary border-l-2 border-accent-secondary" : "text-text-secondary hover:bg-bg-secondary"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 md:ml-60 pb-20 md:pb-0">
        {children}
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border flex justify-around py-3 z-40">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={cn("flex flex-col items-center gap-1 text-xs", isActive ? "text-accent-secondary" : "text-text-muted")}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}