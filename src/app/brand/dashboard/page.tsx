"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Megaphone, 
  CheckCircle2, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BrandDashboardPage() {
  const stats = [
    {
      title: "Total Claims",
      value: "1,284",
      change: "+12.5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Campaigns",
      value: "3",
      change: "Stable",
      trend: "neutral",
      icon: Megaphone,
    },
    {
      title: "Completion Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle2,
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      change: "-0.1",
      trend: "down",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-8 animate-page">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif text-text-primary">Dashboard Overview</h1>
        <p className="text-text-secondary">Welcome back! Here's what's happening with your brand today.</p>
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
                <span className="text-xs text-text-muted ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Campaigns */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl font-serif">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Summer Skincare Set", status: "Active", claims: 450, total: 500 },
              { name: "Organic Energy Bar", status: "Active", claims: 120, total: 200 },
              { name: "Premium Coffee Pods", status: "Paused", claims: 85, total: 100 },
            ].map((campaign) => (
              <div key={campaign.name} className="flex items-center justify-between p-3 rounded-card bg-bg-secondary/50">
                <div>
                  <p className="font-medium text-text-primary">{campaign.name}</p>
                  <p className="text-xs text-text-muted">{campaign.claims} / {campaign.total} claimed</p>
                </div>
                <Badge variant={campaign.status === "Active" ? "success" : "warning"}>
                  {campaign.status}
                </Badge>
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
            <button className="flex flex-col items-center justify-center p-6 rounded-card border-2 border-dashed border-border hover:border-accent-primary hover:bg-accent-primary/5 transition-all gap-2 group">
              <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
                <Megaphone className="h-5 w-5 text-accent-primary" />
              </div>
              <span className="text-sm font-medium">New Campaign</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 rounded-card border-2 border-dashed border-border hover:border-accent-secondary hover:bg-accent-secondary/5 transition-all gap-2 group">
              <div className="w-10 h-10 rounded-full bg-accent-secondary/10 flex items-center justify-center group-hover:bg-accent-secondary/20 transition-colors">
                <Truck className="h-5 w-5 text-accent-secondary" />
              </div>
              <span className="text-sm font-medium">Generate Waybills</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function not imported
import { cn } from "@/lib/utils";
import { Truck } from "lucide-react";
