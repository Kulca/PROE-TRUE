"use client";

import * as React from "react";
import { Sidebar, NavItem } from "@/components/shared/sidebar";
import { 
  LayoutDashboard, 
  Megaphone, 
  Truck, 
  BarChart3, 
  Settings,
  CreditCard 
} from "lucide-react";

const brandNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/brand/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Campaigns",
    href: "/brand/campaigns",
    icon: Megaphone,
  },
  {
    label: "Waybills",
    href: "/brand/waybills",
    icon: Truck,
  },
  {
    label: "Analytics",
    href: "/brand/analytics",
    icon: BarChart3,
  },
  {
    label: "Billing",
    href: "/brand/billing",
    icon: CreditCard,
  },
  {
    label: "Settings",
    href: "/brand/settings",
    icon: Settings,
  },
];

const mockUser = {
  name: "Boutique Brand",
  email: "hello@boutique.co.za",
  role: "brand",
};

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar items={brandNavItems} user={mockUser} />
      <main className="lg:pl-60 pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
