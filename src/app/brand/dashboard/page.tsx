"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Megaphone,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BrandDashboardPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const campaigns = useQuery(
    api.campaigns.listByBrand,
    userId ? { brand_id: userId } : "skip"
  );
  const activeCampaigns = React.useMemo(() => {
    if (!campaigns) return [];
    return campaigns.filter((c: any) => c.is_active);
  }, [campaigns]);

  const totalClaims = React.useMemo(() => {
    if (!campaigns) return 0;
    // Rough estimate from inventory difference
    return campaigns.reduce((sum: number, c: any) => sum + c.inventory_count, 0);
  }, [campaigns]);

  const avgProgress = React.useMemo(() => {
    if (!campaigns || campaigns.length === 0) return 0;
    // Not exact since we don't have claim counts, but show what we have
    return activeCampaigns.length;
  }, [campaigns, activeCampaigns]);

  const stats = [
    {
      title: "Active Campaigns",
      value: activeCampaigns.length.toString(),
      change: campaigns ? `${campaigns.length} total` : "—",
      trend: "neutral" as const,
      icon: Megaphone,
    },
    {
      title: "Total Inventory",
      value: totalClaims.toString(),
      change: "Items",
      trend: "neutral" as const,
      icon: Users,
    },
    {
      title: "Active Count",
      value: campaigns ? campaigns.filter((c: any) => c.is_active).length.toString() : "0",
      change: "campaigns live",
      trend: "up" as const,
      icon: CheckCircle2,
    },
    {
      title: "Categories",
      value: campaigns
        ? [...new Set(campaigns.map((c: any) => c.category))].length.toString()
        : "0",
      change: "unique",
      trend: "neutral" as const,
      icon: TrendingUp,
    },
  ];

  if (!userId) {
    return (
      <div className="space-y-8 animate-page">
        <h1 className="text-3xl font-serif text-text-primary">Dashboard Overview</h1>
        <p className="text-text-secondary">Please sign in as a brand to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-page">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif text-text-primary">Dashboard Overview</h1>
        <p className="text-text-secondary">Welcome back! Here&apos;s what&apos;s happening with your brand today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-text-muted font-sans">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-text-muted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" && <ArrowUpRight className="h-3 w-3 text-success" />}
                {stat.trend === "down" && <ArrowDownRight className="h-3 w-3 text-error" />}
                <span className={cn(
                  "text-xs font-medium",
                  stat.trend === "up" ? "text-success" : stat.trend === "down" ? "text-error" : "text-text-muted"
                )}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Campaigns */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-serif">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeCampaigns.length === 0 && (
              <p className="text-sm text-text-muted">No active campaigns yet.</p>
            )}
            {activeCampaigns.slice(0, 5).map((campaign: any) => (
              <div key={campaign._id} className="flex items-center justify-between p-3 rounded-card bg-bg-secondary/50">
                <div>
                  <p className="font-medium text-text-primary">{campaign.title}</p>
                  <p className="text-xs text-text-muted">{campaign.inventory_count} units remaining</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-serif">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/brand/campaigns/new" className="flex flex-col items-center justify-center p-6 rounded-card border-2 border-dashed border-border hover:border-accent-primary hover:bg-accent-primary/5 transition-all gap-2 group">
              <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
                <Megaphone className="h-5 w-5 text-accent-primary" />
              </div>
              <span className="text-sm font-medium">New Campaign</span>
            </Link>
            <Link href="/brand/waybills" className="flex flex-col items-center justify-center p-6 rounded-card border-2 border-dashed border-border hover:border-accent-secondary hover:bg-accent-secondary/5 transition-all gap-2 group">
              <div className="w-10 h-10 rounded-full bg-accent-secondary/10 flex items-center justify-center group-hover:bg-accent-secondary/20 transition-colors">
                <Truck className="h-5 w-5 text-accent-secondary" />
              </div>
              <span className="text-sm font-medium">Generate Waybills</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}