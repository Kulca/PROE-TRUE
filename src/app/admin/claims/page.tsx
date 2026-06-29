"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const STATUS_COLORS: Record<string, "secondary" | "warning" | "accent" | "error"> = {
  pending: "warning",
  in_transit: "accent",
  ready_for_pickup: "accent",
  collected: "secondary",
};

export default function AdminClaimsPage() {
  const [search, setSearch] = React.useState("");
  const claims = useQuery(api.admin.listAllClaims, {}) ?? [];

  const filtered = claims.filter((c: any) => {
    const id = c._id.toLowerCase();
    const query = search.toLowerCase();
    return !search || id.includes(query);
  });

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

      {claims.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-muted">No claims yet.</p>
        </div>
      )}

      <div className="rounded-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-secondary border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Claim ID</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Campaign</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Status</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Tracking</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((claim: any) => (
              <tr key={claim._id} className="hover:bg-bg-secondary/50 transition-colors">
                <td className="px-4 py-3 font-medium text-text-primary font-mono text-xs">
                  {claim._id.slice(0, 10)}...
                </td>
                <td className="px-4 py-3 text-text-secondary">
                  {claim.campaign_id?.slice(0, 10) ?? "—"}...
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_COLORS[claim.shipping_status] || "secondary"}>
                    {claim.shipping_status?.replace(/_/g, " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-text-secondary font-mono text-xs">
                  {claim.pudo_tracking_number ?? "—"}
                </td>
                <td className="px-4 py-3 text-text-muted text-xs">
                  {claim.createdAt ? new Date(claim.createdAt).toLocaleDateString("en-ZA") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && claims.length > 0 && (
          <div className="p-8 text-center text-text-muted text-sm">No claims match your search.</div>
        )}
      </div>
    </div>
  );
}