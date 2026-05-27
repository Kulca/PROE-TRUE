"use client";
import { useState } from "react";
import { Lock, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CLAIMS = [
  { id: "1", title: "Rooibos Ice Tea Sampler", brand: "Cape Brew Co.", status: "ready_for_pickup", pin: "4829", locker: "Sandton City", updatedAt: "2 hours ago", needsSurvey: false },
  { id: "2", title: "Chai Latte Blend", brand: "Spice Route Co.", status: "in_transit", pin: null, locker: "Rosebank Mall", updatedAt: "1 day ago", needsSurvey: false },
  { id: "3", title: "Mango Chutney Sample Pack", brand: "Durban Flavours", status: "pending", pin: null, locker: "Gateway Theatre", updatedAt: "3 days ago", needsSurvey: false },
  { id: "4", title: "Winter Beanie", brand: "JHB Knitwear", status: "collected", pin: "7152", locker: "Sandton City", updatedAt: "1 week ago", needsSurvey: true },
];

const statusColors: Record<string, "success" | "warning" | "error" | "default"> = {
  pending: "warning",
  in_transit: "default",
  ready_for_pickup: "success",
  collected: "default",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  in_transit: "In Transit",
  ready_for_pickup: "Ready for Pickup",
  collected: "Collected",
};

export default function ClaimsPage() {
  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2">My Claims</h1>
        <p className="text-text-secondary">Track your freebies and complete surveys to unlock more.</p>
      </div>

      <div className="space-y-4">
        {CLAIMS.map((claim) => (
          <Card key={claim.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif text-lg">{claim.title}</h3>
                  {claim.needsSurvey && (
                    <Lock className="w-4 h-4 text-warning" />
                  )}
                </div>
                <p className="text-sm text-text-secondary mb-3">{claim.brand}</p>
                <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Badge variant={statusColors[claim.status]}>{statusLabels[claim.status]}</Badge>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {claim.locker}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {claim.updatedAt}
                  </span>
                </div>
                {claim.pin && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-bg-secondary px-3 py-1.5 rounded">
                    <span className="text-xs text-text-muted">PIN:</span>
                    <span className="font-mono text-sm font-medium">{claim.pin}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end">
                {claim.needsSurvey && (
                  <Button size="sm" variant="primary">
                    Complete Survey
                  </Button>
                )}
                {claim.status === "ready_for_pickup" && (
                  <span className="text-xs text-success font-medium">Show PIN at locker</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}