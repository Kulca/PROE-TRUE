"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreHorizontal, Eye, Edit3, Power } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  new_launch: "New Launch",
  clearance: "Clearance",
  out_of_season: "Out of Season",
  odd_sizing: "Odd Sizing",
  closing_down: "Closing Down",
};

export default function BrandCampaignsPage() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const campaigns = useQuery(
    api.campaigns.listByBrand,
    userId ? { brand_id: userId } : "skip"
  );
  const deactivateCampaign = useMutation(api.campaigns.deactivate);

  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!campaigns) return [];
    return campaigns.filter((c: any) =>
      !search || c.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [campaigns, search]);

  const handleDeactivate = async (campaignId: any) => {
    if (!userId) return;
    try {
      await deactivateCampaign({
        campaign_id: campaignId,
        actor_brand_id: userId,
      });
      toast("success", "Campaign deactivated.");
    } catch (err: any) {
      toast("error", err.message ?? "Failed to deactivate.");
    }
  };

  if (!userId) {
    return (
      <div className="space-y-8 animate-page">
        <h1 className="text-3xl font-serif text-text-primary">Campaigns</h1>
        <p className="text-text-secondary">Please sign in to manage your campaigns.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif text-text-primary">Campaigns</h1>
          <p className="text-text-secondary">Manage and track your active freebie campaigns.</p>
        </div>
        <Link href="/brand/campaigns/new">
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> New Campaign
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input placeholder="Search campaigns..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
      </div>

      {campaigns === undefined && (
        <div className="text-center py-16">
          <p className="text-text-muted">Loading campaigns...</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((campaign: any) => (
          <Card key={campaign._id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                <div className="w-full md:w-24 h-24 rounded-card bg-bg-secondary flex items-center justify-center shrink-0">
                  <div className="w-12 h-12 rounded-subtle bg-accent-primary/20" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-medium text-text-primary truncate">{campaign.title}</h3>
                    <Badge variant={campaign.is_active ? "success" : "warning"}>
                      {campaign.is_active ? "Active" : "Paused"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
                    <span>{CATEGORY_LABELS[campaign.category] ?? campaign.category}</span>
                    <span>•</span>
                    <span>Created {new Date(campaign.createdAt).toLocaleDateString("en-ZA")}</span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-text-primary">{campaign.inventory_count} units</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {campaign.is_active && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDeactivate(campaign._id)}
                      >
                        <Power className="h-4 w-4 text-error" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && campaigns !== undefined && (
          <div className="text-center py-16 text-text-muted">
            <p>No campaigns yet.</p>
            <Link href="/brand/campaigns/new" className="mt-4 inline-block">
              <Button variant="primary">Create your first campaign</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}