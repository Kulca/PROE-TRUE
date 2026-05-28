"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const MOCK_CLAIMS = [
  { id: "1", user: "Nomvuso Dlamini", campaign: "Summer Skincare Trial Kit", status: "collected", locker: "Rosebank Mall", createdAt: "2024-03-20" },
  { id: "2", user: "Amara Singh", campaign: "Chai Latte Blend", status: "in_transit", locker: "Sandton City", createdAt: "2024-03-21" },
  { id: "3", user: "Johan Smith", campaign: "Mango Chutney Pack", status: "ready_for_pickup", locker: "Century City", createdAt: "2024-03-22" },
  { id: "4", user: "Lisa van Wyk", campaign: "Biltong Spice Mix", status: "pending", locker: "Brooklyn Mall", createdAt: "2024-03-23" },
];

const STATUS_COLORS: Record<string, "secondary" | "warning" | "accent" | "error"> = {
  pending: "warning",
  in_transit: "accent",
  ready_for_pickup: "accent",
  collected: "secondary",
};

export default function AdminClaimsPage() {
  const [search, setSearch] = React.useState("");
  const claims = MOCK_CLAIMS.filter((c) =>
    !search || c.user.toLowerCase().includes(search.toLowerCase()) || c.campaign.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-text-primary">Claims</h1>
        <p className="text-text-secondary mt-1">Track all sample claims and shipping status.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input placeholder="Search claims..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 max-w-md" />
      </div>

      <div className="rounded-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-secondary border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-text-muted">User</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Campaign</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Locker</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-bg-secondary/50 transition-colors">
                <td className="px-4 py-3 font-medium text-text-primary">{claim.user}</td>
                <td className="px-4 py-3 text-text-secondary">{claim.campaign}</td>
                <td className="px-4 py-3 text-text-secondary">{claim.locker}</td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_COLORS[claim.status] || "secondary"}>
                    {claim.status.replace(/_/g, " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-text-muted text-xs">{claim.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {claims.length === 0 && <div className="p-8 text-center text-text-muted text-sm">No claims found.</div>}
      </div>
    </div>
  );
}
