"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Megaphone, Package, ClipboardCheck, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = useQuery(api.admin.getStats, {});

  const STATS_CARDS = stats
    ? [
        { label: "Total Users", value: stats.totalUsers, icon: Users },
        { label: "Active Campaigns", value: stats.activeCampaigns, icon: Megaphone },
        { label: "Claims Collected", value: stats.collectedClaims, icon: Package },
        { label: "Surveys Submitted", value: stats.totalSurveys, icon: ClipboardCheck },
        { label: "Verified Brands", value: stats.verifiedBrands, icon: TrendingUp },
        { label: "Pending Verification", value: stats.pendingVerification, icon: Users },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-text-primary">Platform Overview</h1>
        <p className="text-text-secondary mt-1">Live stats across all modules.</p>
      </div>

      {stats === undefined && (
        <div className="text-center py-16">
          <p className="text-text-muted">Loading stats...</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {STATS_CARDS.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-card flex items-center justify-center bg-accent-primary/10">
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
            <CardTitle className="text-lg font-serif">Platform Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats && (
              <>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <p className="text-sm text-text-primary">Total Brands</p>
                  <span className="font-medium">{stats.totalBrands}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <p className="text-sm text-text-primary">Total Consumers</p>
                  <span className="font-medium">{stats.totalConsumers}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <p className="text-sm text-text-primary">Total Campaigns</p>
                  <span className="font-medium">{stats.totalCampaigns}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <p className="text-sm text-text-primary">Total Claims</p>
                  <span className="font-medium">{stats.totalClaims}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-sm text-text-primary">Average Rating</p>
                  <span className="font-medium">{stats.avgRating.toFixed(1)} / 5</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-serif">Verification Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats && (
              <>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <p className="text-sm text-text-primary">Verified Brands</p>
                  <span className="font-medium text-accent-primary">{stats.verifiedBrands}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <p className="text-sm text-text-primary">Pending Verification</p>
                  <span className="font-medium text-warning">{stats.pendingVerification}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-sm text-text-primary">Unverified</p>
                  <span className="font-medium text-text-muted">{stats.totalBrands - stats.verifiedBrands - stats.pendingVerification}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}