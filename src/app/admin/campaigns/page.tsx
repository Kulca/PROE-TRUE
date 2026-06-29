"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

const CAT_LABELS: Record<string, string> = {
  new_launch: "New Launch", clearance: "Clearance", out_of_season: "Out of Season", odd_sizing: "Odd Sizing", closing_down: "Closing Down"
};

export default function AdminCampaignsPage() {
  const { toast } = useToast();
  const [search, setSearch] = React.useState("");

  const campaigns = useQuery(api.admin.listAllCampaigns, {}) ?? [];
  const toggleFeatured = useMutation(api.admin.toggleFeatured);

  const filtered = campaigns.filter((c: any) =>
    !search || c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleFeatured = async (campaignId: any, isFeatured: boolean) => {
    try {
      await toggleFeatured({ campaignId, is_featured: !isFeatured });
      toast("success", `Campaign ${!isFeatured ? "featured" : "unfeatured"} successfully.`);
    } catch (err: any) {
      toast("error", err.message ?? "Failed to toggle featured status.");
    }
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

      {campaigns.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-muted">No campaigns yet.</p>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((c: any) => (
          <Card key={c._id}>
            <CardContent className="p-6 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-serif text-text-primary">{c.title}</h3>
                  <Badge variant={c.category === "new_launch" ? "accent" : c.category === "clearance" ? "warning" : "secondary"}>{CAT_LABELS[c.category] ?? c.category}</Badge>
                  {c.is_featured && <Badge variant="accent"><Star className="h-3 w-3 mr-1" />Featured</Badge>}
                  {!c.is_active && <Badge variant="error">Inactive</Badge>}
                </div>
                <p className="text-sm text-text-secondary mt-1">
                  {c.inventory_count} units · Created {new Date(c.createdAt).toLocaleDateString("en-ZA")}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  size="sm"
                  variant={c.is_featured ? "secondary" : "primary"}
                  onClick={() => handleToggleFeatured(c._id, c.is_featured)}
                >
                  <Star className="h-3 w-3 mr-1" />
                  {c.is_featured ? "Unfeature" : "Feature"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && campaigns.length > 0 && (
          <p className="text-text-muted text-sm text-center py-8">No campaigns match your search.</p>
        )}
      </div>
    </div>
  );
}