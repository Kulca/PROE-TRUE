"use client";

import * as React from "react";
import { Sidebar, NavItem } from "@/components/shared/sidebar";
import { 
  Store, 
  PackageCheck, 
  ClipboardCheck, 
  UserCircle 
} from "lucide-react";

const consumerNavItems: NavItem[] = [
  {
    label: "Marketplace",
    href: "/consumer/marketplace",
    icon: Store,
  },
  {
    label: "My Claims",
    href: "/consumer/claims",
    icon: PackageCheck,
  },
  {
    label: "Surveys",
    href: "/consumer/surveys",
    icon: ClipboardCheck,
  },
  {
    label: "Profile",
    href: "/consumer/profile",
    icon: UserCircle,
  },
];

const mockUser = {
  name: "Thabo Mokoena",
  email: "thabo@proe.co.za",
  role: "consumer",
};

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar items={consumerNavItems} user={mockUser} />
      <main className="lg:pl-60 pb-20 lg:pb-0">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
