"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Truck,
  MapPin,
  Lock,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  pending: "Processing",
  in_transit: "In Transit",
  ready_for_pickup: "Ready for Pickup",
  collected: "Collected",
};

const STATUS_VARIANTS: Record<string, "success" | "warning" | "secondary" | "default"> = {
  ready_for_pickup: "success",
  in_transit: "warning",
  collected: "secondary",
  pending: "default",
};

export default function MyClaimsPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const claimsData = useQuery(api.claims.listByUser, userId ? { user_id: userId } : "skip");

  const claims = React.useMemo(() => {
    if (!claimsData) return [];
    return claimsData.map((claim: any) => ({
      id: claim._id,
      claimRef: claim._id.slice(0, 8),
      title: claim.campaign?.title ?? "Unknown",
      brand: claim.campaign?.brand_name ?? "Brand",
      status: claim.shipping_status,
      locker: claim.selected_locker_id ?? "N/A",
      pin: claim.pudo_pin_code ?? "—",
      tracking: claim.pudo_tracking_number ?? "—",
      needsSurvey: !claim.survey_submitted && (claim.shipping_status === "collected" || claim.shipping_status === "ready_for_pickup"),
      image: claim.campaign?.image_url ?? undefined,
    }));
  }, [claimsData]);

  if (!userId) {
    return (
      <div className="space-y-8 animate-page">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif text-text-primary">My Claims</h1>
          <p className="text-text-secondary">Please sign in to view your claims.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-page">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif text-text-primary">My Claims</h1>
        <p className="text-text-secondary">Track your samples and find your PUDO pickup codes.</p>
      </div>

      {claims.length === 0 && claimsData !== undefined && (
        <div className="text-center py-20">
          <p className="text-text-muted text-lg font-serif">No claims yet.</p>
          <Link href="/consumer/marketplace" className="mt-4 inline-block">
            <Button variant="primary">Explore Marketplace</Button>
          </Link>
        </div>
      )}

      {claimsData === undefined && (
        <div className="text-center py-20">
          <p className="text-text-muted">Loading your claims...</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {claims.map((claim: any) => (
          <Card key={claim.id} className={cn(
            "overflow-hidden",
            claim.needsSurvey && "border-warning/30"
          )}>
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Image & Main Info */}
                <div className="flex flex-1 p-6 gap-6 border-b md:border-b-0 md:border-r border-border">
                  <div className="w-20 h-20 rounded-card overflow-hidden shrink-0 bg-bg-secondary">
                    {claim.image ? (
                      <img src={claim.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-text-primary truncate">{claim.title}</h3>
                      <Badge variant={STATUS_VARIANTS[claim.status] ?? "default"} className="shrink-0">
                        {STATUS_LABELS[claim.status] ?? claim.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-muted mb-4">{claim.brand}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <MapPin className="h-3.5 w-3.5 text-accent-primary" />
                        <span className="truncate">{claim.locker}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <Truck className="h-3.5 w-3.5 text-accent-secondary" />
                        <span className="font-mono">{claim.tracking}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Specific Action */}
                <div className={cn(
                  "p-6 md:w-64 flex flex-col justify-center gap-3",
                  claim.status === "ready_for_pickup" ? "bg-accent-primary/5" : "bg-bg-secondary/20"
                )}>
                  {claim.status === "ready_for_pickup" ? (
                    <>
                      <div className="text-center space-y-1 mb-2">
                        <p className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Pickup PIN</p>
                        <p className="text-3xl font-mono font-bold text-accent-primary tracking-[0.2em]">{claim.pin}</p>
                      </div>
                      <Button variant="primary" size="sm" className="w-full">
                        Show QR
                      </Button>
                    </>
                  ) : claim.needsSurvey ? (
                    <>
                      <div className="flex items-center gap-2 text-warning mb-1 justify-center">
                        <Lock className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase tracking-tight">Survey Required</span>
                      </div>
                      <Link href="/consumer/surveys">
                        <Button variant="secondary" size="sm" className="w-full">
                          <ClipboardCheck className="mr-2 h-4 w-4" /> Take Survey
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Button variant="secondary" size="sm" className="w-full" disabled={claim.status === "collected"}>
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}