"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Package, Truck, CheckCircle2, Clock } from "lucide-react";

export default function AdminClaimsPage() {
  const claims = useQuery(api.admin.getAllClaims);

  return (
    <div className="space-y-8 animate-page">
      <div>
        <h1 className="text-3xl font-serif text-text-primary">Claims Tracker</h1>
        <p className="text-text-secondary mt-1">Monitor all sample claims and shipping statuses.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-secondary/50 border-b border-border text-xs uppercase tracking-wider text-text-muted">
                  <th className="px-6 py-4 font-semibold">Claim ID</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">PUDO Pin</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {!claims ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse h-16 bg-bg-secondary/10" />
                  ))
                ) : claims.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-text-muted italic">No claims found.</td>
                  </tr>
                ) : (
                  claims.map((claim) => (
                    <tr key={claim._id} className="hover:bg-bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{claim._id}</td>
                      <td className="px-6 py-4">
                        <Badge 
                          variant="outline" 
                          className="gap-1.5"
                        >
                          {claim.shipping_status === "collected" ? <CheckCircle2 className="h-3 w-3 text-success" /> : <Truck className="h-3 w-3 text-warning" />}
                          {claim.shipping_status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-bold text-accent-primary">{claim.pudo_pin_code}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
