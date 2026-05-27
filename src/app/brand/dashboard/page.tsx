"use client";
import Link from "next/link";
import { Package, Users, Star, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const METRICS = [
  { label: "Total Claims", value: "1,847", change: "+12%", icon: Users },
  { label: "Active Campaigns", value: "4", change: "+2", icon: Package },
  { label: "Avg. Survey Rating", value: "4.6", change: "+0.3", icon: Star },
  { label: "Collection Rate", value: "94%", change: "+5%", icon: TrendingUp },
];

const RECENT_CLAIMS = [
  { id: "1", product: "Rooibos Ice Tea", claimer: "Thandi M.", status: "collected", time: "2h ago" },
  { id: "2", product: "Chai Latte Blend", claimer: "Johan K.", status: "in_transit", time: "4h ago" },
  { id: "3", product: "Winter Beanie", claimer: "Lisa N.", status: "pending", time: "6h ago" },
];

export default function BrandDashboardPage() {
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl mb-1">Overview</h1>
          <p className="text-text-secondary">Welcome back, Safari Spices</p>
        </div>
        <Link href="/brand/campaigns/new">
          <Button>+ New Campaign</Button>
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {METRICS.map((m) => (
          <Card key={m.label} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-text-muted">{m.label}</span>
              <m.icon className="w-4 h-4 text-text-muted" />
            </div>
            <p className="font-serif text-3xl mb-1">{m.value}</p>
            <span className="text-xs text-success font-medium">{m.change} this month</span>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Claims */}
        <Card className="p-5">
          <h2 className="font-serif text-xl mb-4">Recent Claims</h2>
          <div className="space-y-3">
            {RECENT_CLAIMS.map((c) => (
              <div key={c.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-sm">{c.product}</p>
                  <p className="text-xs text-text-muted">{c.claimer}</p>
                </div>
                <div className="text-right">
                  <Badge variant={c.status === "collected" ? "success" : c.status === "in_transit" ? "default" : "warning"}>
                    {c.status.replace("_", " ")}
                  </Badge>
                  <p className="text-xs text-text-muted mt-0.5">{c.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-5">
          <h2 className="font-serif text-xl mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/brand/campaigns/new" className="block">
              <Button variant="secondary" className="w-full justify-start">+ Launch New Campaign</Button>
            </Link>
            <Link href="/brand/waybills" className="block">
              <Button variant="secondary" className="w-full justify-start">Generate PUDO Waybill</Button>
            </Link>
            <Link href="/brand/analytics" className="block">
              <Button variant="secondary" className="w-full justify-start">View Feedback Report</Button>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}