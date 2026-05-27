"use client";

import * as React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, MapPin, Package } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";

export default function MarketplacePage() {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = React.useState<any>(null);
  const [isClaiming, setIsClaiming] = React.useState(false);

  const campaigns = [
    {
      id: "1",
      title: "Summer Skincare Trial Kit",
      brand: "Glow Beauty",
      category: "New Launch",
      size: "XS",
      province: "Gauteng",
      description: "Experience our new 3-step skincare routine for a glowing summer skin. Includes cleanser, toner, and moisturizer.",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: "2",
      title: "Organic Almond Energy Bar",
      brand: "Pure Bites",
      category: "Clearance",
      size: "S",
      province: "Western Cape",
      description: "A perfect snack for your morning hikes. Made with 100% organic almonds and honey.",
      image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: "3",
      title: "Premium Arabica Coffee Pods",
      brand: "Roast Master",
      category: "Out of Season",
      size: "M",
      province: "KwaZulu-Natal",
      description: "Taste the rich flavors of our limited edition winter roast. Compatible with all Nespresso machines.",
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=60",
    },
    {
      id: "4",
      title: "Bamboo Fiber Kitchen Towels",
      brand: "EcoHome",
      category: "Odd Sizing",
      size: "L",
      province: "Eastern Cape",
      description: "Highly absorbent and sustainable kitchen towels made from natural bamboo fibers.",
      image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=800&auto=format&fit=crop&q=60",
    },
  ];

  const handleClaim = () => {
    setIsClaiming(true);
    setTimeout(() => {
      setIsClaiming(false);
      setSelectedCampaign(null);
      toast("success", "Sample claimed successfully! Check 'My Claims' for details.");
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-page">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-serif text-text-primary">Freebie Marketplace</h1>
        <p className="text-text-secondary">Discover and claim free samples from your favorite brands.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input placeholder="Search freebies..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="md">
            <Filter className="mr-2 h-4 w-4" /> Category
          </Button>
          <Button variant="secondary" size="md">
            <MapPin className="mr-2 h-4 w-4" /> Province
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="group cursor-pointer overflow-hidden flex flex-col h-full" onClick={() => setSelectedCampaign(campaign)}>
            <div className="aspect-[3/2] overflow-hidden bg-bg-secondary relative">
              <img 
                src={campaign.image} 
                alt={campaign.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="accent">{campaign.category}</Badge>
              </div>
            </div>
            <CardContent className="p-4 flex-1">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-accent-secondary uppercase tracking-wider">{campaign.brand}</p>
                <h3 className="text-lg font-serif text-text-primary leading-tight line-clamp-2">{campaign.title}</h3>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Package className="h-3.5 w-3.5" />
                  <span>Size {campaign.size}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{campaign.province}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button variant="primary" className="w-full" onClick={(e) => {
                e.stopPropagation();
                setSelectedCampaign(campaign);
              }}>
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Claim Modal */}
      <Modal 
        isOpen={!!selectedCampaign} 
        onClose={() => setSelectedCampaign(null)}
        title="Claim Sample"
      >
        {selectedCampaign && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-24 h-24 rounded-card overflow-hidden shrink-0">
                <img src={selectedCampaign.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-lg leading-tight">{selectedCampaign.title}</h4>
                <p className="text-sm text-text-muted mt-1">{selectedCampaign.brand}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{selectedCampaign.category}</Badge>
                  <Badge variant="outline">{selectedCampaign.size}</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-text-primary">About this sample</p>
              <p className="text-sm text-text-secondary leading-relaxed">{selectedCampaign.description}</p>
            </div>

            <div className="p-4 rounded-card bg-bg-secondary border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pickup Location</span>
                <span className="text-xs text-accent-primary font-medium">Change</span>
              </div>
              <div className="flex items-start gap-3 text-text-secondary">
                <MapPin className="h-4 w-4 mt-0.5 text-accent-primary" />
                <div className="text-xs">
                  <p className="font-medium text-text-primary">PUDO Locker: Rosebank Mall</p>
                  <p>15A Cradock Ave, Rosebank, Johannesburg, 2196</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] text-text-muted italic">
                By claiming this sample, you agree to complete a short survey within 48 hours of collection. Subsequent claims will be locked until the survey is submitted.
              </p>
              <Button className="w-full" size="lg" onClick={handleClaim} isLoading={isClaiming}>
                Confirm Claim
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
