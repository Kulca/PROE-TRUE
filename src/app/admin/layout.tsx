"use client";

import { Sidebar, NavItem } from "@/components/shared/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  ClipboardCheck, 
  MessageSquare,
  ShieldCheck
} from "lucide-react";

const adminNavItems: NavItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users & Verification", href: "/admin/users", icon: Users },
  { label: "Campaigns", href: "/admin/campaigns", icon: Megaphone },
  { label: "Claims", href: "/admin/claims", icon: ClipboardCheck },
  { label: "Surveys", href: "/admin/surveys", icon: MessageSquare },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar 
        items={adminNavItems} 
        user={{ name: "Admin", email: "admin@proe.app", role: "admin" }} 
      />
      <main className="lg:pl-60 pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
