"use client";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { CATEGORIES, SA_PROVINCES } from "@/lib/utils";

// Mock data
const CAMPAIGNS = [
  { id: "1", title: "Rooibos Ice Tea Sampler", description: "3-pack of refreshing iced rooibos teas. New flavour launch!", category: "new_launch", inventory: 142, brand: "Cape Brew Co." },
  { id: "2", title: "Biltong Spice Mix Clearance", description: "Finish off the batch. Make your own biltong at home.", category: "clearance", inventory: 28, brand: "Safari Spices" },
  { id: "3", title: "Winter Beanie - Odd Size", description: "One size left. Slightly irregular stitching on rim.", category: "odd_sizing", inventory: 15, brand: "JHB Knitwear" },
  { id: "4", title: "Mango Chutney Sample Pack", description: "Out of season clearout. Sweet & tangy mango chutney.", category: "out_of_season", inventory: 67, brand: "Durban Flavours" },
  { id: "5", title: "Beaded Bracelet Set", description: "Closing down inventory. Beautiful handcrafted bracelets.", category: "closing_down", inventory: 8, brand: " township Artisans" },
  { id: "6", title: "Chai Latte Blend", description: "New launch! Authentic Indian chai spice blend.", category: "new_launch", inventory: 203, brand: "Spice Route Co." },
];

const categoryColors: Record<string, "accent" | "secondary" | "warning" | "error"> = {
  new_launch: "accent",
  clearance: "warning",
  out_of_season: "secondary",
  odd_sizing: "error",
  closing_down: "error",
};

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<typeof CAMPAIGNS[0] | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const filtered = CAMPAIGNS.filter((c) => {
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedCategory && c.category !== selectedCategory) return false;
    return true;
  });

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2">Discover Freebies</h1>
        <p className="text-text-secondary">Find free samples from South African brands near you.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "primary" : "secondary"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "primary" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((campaign) => (
          <Card key={campaign.id} hover className="overflow-hidden">
            <div className="bg-bg-secondary h-40 flex items-center justify-center">
              <span className="text-text-muted text-sm">{campaign.brand}</span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-serif text-lg leading-tight">{campaign.title}</h3>
                <Badge variant={categoryColors[campaign.category]}>
                  {CATEGORIES[campaign.category as keyof typeof CATEGORIES]}
                </Badge>
              </div>
              <p className="text-sm text-text-secondary mb-4 line-clamp-2">{campaign.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">{campaign.inventory} left</span>
                <Button size="sm" onClick={() => { setSelectedCampaign(campaign); setShowClaimModal(true); }}>
                  Claim Freebie
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-muted">No campaigns found matching your filters.</p>
        </div>
      )}

      {/* Claim Modal */}
      <Modal isOpen={showClaimModal} onClose={() => setShowClaimModal(false)} title="Claim Your Freebie">
        {selectedCampaign && (
          <div className="space-y-4">
            <div className="p-3 bg-bg-secondary rounded">
              <p className="font-medium">{selectedCampaign.title}</p>
              <p className="text-sm text-text-secondary">{selectedCampaign.brand}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Collection Point</p>
              <p className="text-sm text-text-secondary">PUDO Locker — Sandton City, Gauteng</p>
            </div>
            <div className="p-3 bg-warning/10 border border-warning/20 rounded text-sm">
              <strong>Survey commitment:</strong> By claiming, you agree to complete a brief 5-star survey after collection to unlock future claims.
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setShowClaimModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={() => { setShowClaimModal(false); }} className="flex-1">Confirm Claim</Button>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}