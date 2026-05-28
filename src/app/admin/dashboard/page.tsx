"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Megaphone, 
  ClipboardCheck, 
  ShieldAlert,
  TrendingUp,
  Activity
} from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Users", value: "1,284", icon: Users, color: "text-blue-600" },
    { label: "Active Campaigns", value: "42", icon: Megaphone, color: "text-accent-primary" },
    { label: "Total Claims", value: "856", icon: ClipboardCheck, color: "text-success" },
    { label: "Pending Verification", value: "7", icon: ShieldAlert, color: "text-warning" },
  ];

  return (
    <div className="space-y-8 animate-page">
      <div>
        <h1 className="text-3xl font-serif text-text-primary">Admin Godmode</h1>
        <p className="text-text-secondary mt-1">Platform overview and system metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-muted uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-3xl font-bold text-text-primary mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-card bg-bg-secondary ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-serif">Platform Activity</CardTitle>
              <Activity className="h-5 w-5 text-text-muted" />
            </div>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center border-t border-border bg-bg-secondary/30">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-border mx-auto mb-4" />
              <p className="text-sm text-text-muted italic underline decoration-accent-primary decoration-2 underline-offset-4">Activity chart visualization (Coming soon)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-serif">System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 border-t border-border pt-6">
            {[
              { label: "Database", status: "Healthy", color: "bg-success" },
              { label: "Authentication", status: "Operational", color: "bg-success" },
              { label: "PUDO Integration", status: "Slow Response", color: "bg-warning" },
              { label: "Image Storage", status: "Healthy", color: "bg-success" },
            ].map((system) => (
              <div key={system.label} className="flex items-center justify-between p-3 rounded-card bg-bg-secondary/50 border border-border">
                <span className="text-sm font-medium text-text-primary">{system.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${system.color}`} />
                  <span className="text-xs text-text-secondary">{system.status}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
