"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  
  Truck, 
  MapPin, 
  Lock, 
  ClipboardCheck,
  ChevronRight,
  QrCode
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MyClaimsPage() {
  const claims = [
    {
      id: "C-98210",
      title: "Summer Skincare Trial Kit",
      brand: "Glow Beauty",
      status: "ready_for_pickup",
      locker: "Rosebank Mall",
      pin: "4492",
      tracking: "PUDO12345678",
      needsSurvey: true,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&auto=format&fit=crop&q=60",
    },
    {
      id: "C-98205",
      title: "Organic Almond Energy Bar",
      brand: "Pure Bites",
      status: "in_transit",
      locker: "Rosebank Mall",
      tracking: "PUDO87654321",
      needsSurvey: false,
      image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=200&auto=format&fit=crop&q=60",
    },
    {
      id: "C-98192",
      title: "Bamboo Fiber Kitchen Towels",
      brand: "EcoHome",
      status: "collected",
      locker: "Sandton City",
      tracking: "PUDO11223344",
      needsSurvey: false,
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=200&auto=format&fit=crop&q=60",
    },
  ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Processing";
      case "in_transit": return "In Transit";
      case "ready_for_pickup": return "Ready for Pickup";
      case "collected": return "Collected";
      default: return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ready_for_pickup": return "success";
      case "in_transit": return "warning";
      case "collected": return "secondary";
      default: return "default";
    }
  };

  return (
    <div className="space-y-8 animate-page">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif text-text-primary">My Claims</h1>
        <p className="text-text-secondary">Track your samples and find your PUDO pickup codes.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {claims.map((claim) => (
          <Card key={claim.id} className={cn(
            "overflow-hidden",
            claim.needsSurvey && "border-warning/30"
          )}>
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Image & Main Info */}
                <div className="flex flex-1 p-6 gap-6 border-b md:border-b-0 md:border-r border-border">
                  <div className="w-20 h-20 rounded-card overflow-hidden shrink-0 bg-bg-secondary">
                    <img src={claim.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-text-primary truncate">{claim.title}</h3>
                      <Badge variant={getStatusVariant(claim.status)} className="shrink-0">
                        {getStatusLabel(claim.status)}
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
                        <QrCode className="mr-2 h-4 w-4" /> Show QR
                      </Button>
                    </>
                  ) : claim.status === "collected" && claim.needsSurvey ? (
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
