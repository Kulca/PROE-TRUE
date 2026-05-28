"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Megaphone, Package, ClipboardCheck, TrendingUp } from "lucide-react";

const MOCK_STATS = {
  totalUsers: 284,
  totalBrands: 47,
  totalConsumers: 237,
  verifiedBrands: 31,
  pendingVerification: 8,
  totalCampaigns: 63,
  activeCampaigns: 24,
  totalClaims: 891,
  collectedClaims: 743,
  totalSurveys: 612,
  avgRating: 4.3,
};

const STATS = [
  { label: "Total Users", value: MOCK_STATS.totalUsers, icon: Users, color: "accent" },
  { label: "Active Campaigns", value: MOCK_STATS.activeCampaigns, icon: Megaphone, color: "warning" },
  { label: "Claims Collected", value: MOCK_STATS.collectedClaims, icon: Package, color: "secondary" },
  { label: "Surveys Submitted", value: MOCK_STATS.totalSurveys, icon: ClipboardCheck, color: "accent" },
  { label: "Verified Brands", value: MOCK_STATS.verifiedBrands, icon: TrendingUp, color: "accent" },
  { label: "Pending Verification", value: MOCK_STATS.pendingVerification, icon: Users, color: "warning" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-text-primary">Platform Overview</h1>
        <p className="text-text-secondary mt-1">Live stats across all modules.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-card flex items-center justify-center bg-${color}/10`}>
                <Icon className="h-6 w-6 text-accent-primary" />
              </div>
              <div>
                <p className="text-2xl font-serif font-semibold text-text-primary">{value.toLocaleString()}</p>
                <p className="text-sm text-text-muted">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { text: "New brand registered: Cape Brew Co.", time: "2 min ago" },
              { text: "Campaign approved: Summer Skincare Trial Kit", time: "15 min ago" },
              { text: "Brand verified: Glow Beauty", time: "1 hr ago" },
              { text: "New claim: Roobois Ice Tea Sampler", time: "2 hr ago" },
              { text: "Survey submitted: 5-star rating", time: "3 hr ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <p className="text-sm text-text-primary">{item.text}</p>
                <span className="text-xs text-text-muted">{item.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Pending Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { text: "8 brands awaiting verification", action: "Review now" },
              { text: "3 campaigns pending approval", action: "Review now" },
              { text: "12 claims need tracking update", action: "Update" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <p className="text-sm text-text-primary">{item.text}</p>
                <button className="text-xs text-accent-primary font-medium hover:underline">{item.action}</button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
