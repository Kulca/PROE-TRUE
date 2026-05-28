"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BillboardCarouselProps {
  placement?: "hero" | "brand" | "footer";
  className?: string;
}

export function BillboardCarousel({ placement = "hero", className }: BillboardCarouselProps) {
  const campaigns = useQuery(api.campaigns.listActive);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Filter for billboard-eligible campaigns
  const billboardCampaigns = campaigns?.filter(c => c.billboard_opt_in && c.story) || [];

  React.useEffect(() => {
    if (billboardCampaigns.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % billboardCampaigns.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [billboardCampaigns.length]);

  if (!campaigns) return <div className={cn("h-64 bg-bg-secondary animate-pulse rounded-card", className)} />;
  if (billboardCampaigns.length === 0) return null;

  const current = billboardCampaigns[currentIndex];

  const next = () => setCurrentIndex((prev) => (prev + 1) % billboardCampaigns.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + billboardCampaigns.length) % billboardCampaigns.length);

  return (
    <div className={cn("relative group overflow-hidden rounded-card bg-bg-card border border-border shadow-md", className)}>
      <div className="flex flex-col md:flex-row h-full">
        <div className="w-full md:w-1/2 h-48 md:h-auto relative overflow-hidden bg-bg-secondary">
          {current.image_url ? (
            <img 
              src={current.image_url} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              alt=""
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center opacity-10">
               <Sparkles className="h-20 w-20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
          <div className="absolute top-4 left-4">
             <Badge className="bg-accent-primary text-white border-none shadow-lg">Featured</Badge>
          </div>
        </div>
        
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-accent-primary font-bold text-xs uppercase tracking-widest">
              <Sparkles className="h-3 w-3" />
              {current.brand?.name}
            </div>
            <h2 className={cn(
              "font-serif font-bold text-text-primary leading-tight",
              placement === "hero" ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"
            )}>
              {current.title}
            </h2>
            <p className="text-text-secondary text-sm md:text-base italic line-clamp-3 font-serif">
              "{current.story}"
            </p>
            <div className="pt-2">
              <Button size="sm" className="rounded-full px-6">Claim Now</Button>
            </div>
          </div>
        </div>
      </div>

      {billboardCampaigns.length > 1 && (
        <>
          <button 
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-4 right-8 flex gap-1.5">
            {billboardCampaigns.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1 rounded-full transition-all",
                  i === currentIndex ? "w-4 bg-accent-primary" : "w-1.5 bg-border"
                )} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
