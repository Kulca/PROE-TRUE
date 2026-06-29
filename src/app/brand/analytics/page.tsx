"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Star, MessageSquare, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS = ["#D4772C", "#2C4B7D", "#2D8B4E", "#E5A83B", "#C44536"];

export default function BrandAnalyticsPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const campaigns = useQuery(
    api.campaigns.listByBrand,
    userId ? { brand_id: userId } : "skip"
  );

  const loading = campaigns === undefined;

  // Compute claims by category from campaign inventory
  const categoryData = React.useMemo(() => {
    if (!campaigns) return [];
    const map: Record<string, number> = {};
    const labels: Record<string, string> = {
      new_launch: "Skincare", clearance: "Clearance",
      out_of_season: "Coffee", odd_sizing: "Wellness", closing_down: "Closing",
    };
    for (const c of campaigns) {
      const name = labels[c.category] ?? c.category;
      map[name] = (map[name] || 0) + c.inventory_count;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value })).slice(0, 4);
  }, [campaigns]);

  // Mock weekly data (since we don't have day-level claim tracking)
  const claimsData = [
    { name: "Mon", claims: 0 },
    { name: "Tue", claims: 0 },
    { name: "Wed", claims: 0 },
    { name: "Thu", claims: 0 },
    { name: "Fri", claims: 0 },
    { name: "Sat", claims: 0 },
    { name: "Sun", claims: 0 },
  ];

  const sentimentData = [
    { name: "Positive", value: 0 },
    { name: "Neutral", value: 0 },
    { name: "Negative", value: 0 },
  ];

  return (
    <div className="space-y-8 animate-reveal">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif text-text-primary">Analytics &amp; Feedback</h1>
          <p className="text-text-secondary">Understand how consumers are interacting with your samples.</p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-16">
          <p className="text-text-muted">Loading analytics...</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Claims over time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Campaign Activity</CardTitle>
            <CardDescription>Inventory analysis across your campaigns.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E6E1" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9B9B9B" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#9B9B9B" }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}
                  />
                  <Bar dataKey="value" fill="#D4772C" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Sentiment placeholder */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Campaign Breakdown</CardTitle>
            <CardDescription>Your campaigns by category.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <TrendingUp className="h-4 w-4 text-accent-primary" />
              <span className="text-sm font-medium text-accent-primary">
                {campaigns?.length ?? 0} total campaigns
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Claims by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E8E6E1" />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#1A1A1A" }}
                      width={80}
                    />
                    <Tooltip cursor={{ fill: "transparent" }} />
                    <Bar dataKey="value" fill="#2C4B7D" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-text-muted text-sm">
                  No campaign data yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-serif">Campaign Summary</CardTitle>
              <CardDescription>Overview of your active campaigns.</CardDescription>
            </div>
            <MessageSquare className="h-5 w-5 text-text-muted" />
          </CardHeader>
          <CardContent className="space-y-4 max-h-[260px] overflow-y-auto pr-2">
            {!campaigns || campaigns.length === 0 ? (
              <p className="text-sm text-text-muted">No campaigns yet. Create your first campaign to see analytics.</p>
            ) : (
              campaigns.map((c: any) => (
                <div key={c._id} className="p-3 rounded-card bg-bg-secondary/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">{c.title}</span>
                    <span className="text-[10px] text-text-muted uppercase">
                      {c.inventory_count} units
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {c.is_active ? (
                      <span className="text-xs text-success">Active</span>
                    ) : (
                      <span className="text-xs text-text-muted">Inactive</span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    {c.description}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}