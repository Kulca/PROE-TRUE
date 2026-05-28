"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const MOCK_CAMPAIGNS = [
  { id: "1", title: "Summer Skincare Trial Kit", brand: "Glow Beauty", category: "new_launch", inventory: 142, is_active: true, is_featured: true, billboard_opt_in: true, createdAt: "2024-03-01" },
  { id: "2", title: "Biltong Spice Mix Clearance", brand: "Safari Spices", category: "clearance", inventory: 28, is_active: true, is_featured: false, billboard_opt_in: false, createdAt: "2024-03-05" },
  { id: "3", title: "Winter Beanie - Odd Size", brand: "JHB Knitwear", category: "odd_sizing", inventory: 15, is_active: false, is_featured: false, billboard_opt_in: true, createdAt: "2024-03-10" },
  { id: "4", title: "Mango Chutney Sample Pack", brand: "Durban Flavours", category: "out_of_season", inventory: 67, is_active: true, is_featured: true, billboard_opt_in: true, createdAt: "2024-03-12" },
  { id: "5", title: "Chai Latte Blend", brand: "Spice Route Co.", category: "new_launch", inventory: 203, is_active: true, is_featured: false, billboard_opt_in: false, createdAt: "2024-03-15" },
];

const CAT_LABELS: Record<string, string> = {
  new_launch: "New Launch", clearance: "Clearance", out_of_season: "Out of Season", odd_sizing: "Odd Sizing", closing_down: "Closing Down"
};

export default function AdminCampaignsPage() {
  const [search, setSearch] = React.useState("");
  const [campaigns, setCampaigns] = React.useState(MOCK_CAMPAIGNS);

  const filtered = campaigns.filter((c) =>
    !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.brand.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFeatured = (id: string) => {
    setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, is_featured: !c.is_featured } : c));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-text-primary">Campaign Management</h1>
        <p className="text-text-secondary mt-1">Manage all platform campaigns and featured status.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <Input placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 max-w-md" />
      </div>

      <div className="space-y-4">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-6 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-text-primary">{c.title}</h3>
                  <Badge variant={c.category === "new_launch" ? "accent" : c.category === "clearance" ? "warning" : "secondary"}>{CAT_LABELS[c.category]}</Badge>
                  {c.is_featured && <Badge variant="accent"><Star className="h-3 w-3 mr-1" />Featured</Badge>}
                  {!c.is_active && <Badge variant="error">Inactive</Badge>}
                </div>
                <p className="text-sm text-text-secondary mt-1">{c.brand} · {c.inventory} units · Created {c.createdAt}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  size="sm"
                  variant={c.is_featured ? "secondary" : "primary"}
                  onClick={() => toggleFeatured(c.id)}
                >
                  <Star className="h-3 w-3 mr-1" />
                  {c.is_featured ? "Unfeature" : "Feature"}
                </Button>
                <Button size="sm" variant="ghost">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && <p className="text-text-muted text-sm text-center py-8">No campaigns found.</p>}
      </div>
    </div>
  );
}
