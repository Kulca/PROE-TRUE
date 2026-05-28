"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  StarOff,
  Eye,
  Archive,
  BarChart2,
  Package,
  Calendar
} from "lucide-react";

export default function AdminCampaignsPage() {
  const campaigns = useQuery(api.admin.getAllCampaigns);
  const toggleFeatured = useMutation(api.admin.toggleCampaignFeatured);

  const handleToggleFeatured = async (campaignId: any, currentFeatured: boolean) => {
    try {
      await toggleFeatured({ campaign_id: campaignId, featured: !currentFeatured });
    } catch (error) {
      console.error("Failed to toggle featured status", error);
    }
  };

  return (
    <div className="space-y-8 animate-page">
      <div>
        <h1 className="text-3xl font-serif text-text-primary">Campaign Management</h1>
        <p className="text-text-secondary mt-1">Monitor and feature brand campaigns across the platform.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {!campaigns ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 h-24 bg-bg-secondary/20" />
            </Card>
          ))
        ) : campaigns.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-text-muted italic">
              No campaigns found.
            </CardContent>
          </Card>
        ) : (
          campaigns.map((campaign) => (
            <Card key={campaign._id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-48 h-32 bg-bg-secondary relative flex-shrink-0">
                  {campaign.image_url ? (
                    <img src={campaign.image_url} alt={campaign.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                      <Package className="h-8 w-8 opacity-20" />
                    </div>
                  )}
                  {campaign.featured && (
                    <div className="absolute top-2 left-2 bg-accent-primary text-white p-1 rounded-full">
                      <Star className="h-4 w-4 fill-current" />
                    </div>
                  )}
                </div>
                <CardContent className="p-6 flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-serif font-bold text-text-primary">{campaign.title}</h3>
                      <Badge variant="secondary" className="text-[10px] uppercase">{campaign.category.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-1">{campaign.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                      <span className="flex items-center gap-1"><Package className="h-3 w-3" /> {campaign.inventory_count} items</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(campaign.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={campaign.featured ? "text-accent-primary border-accent-primary/20 bg-accent-primary/5" : "text-text-muted"}
                      onClick={() => handleToggleFeatured(campaign._id, !!campaign.featured)}
                    >
                      {campaign.featured ? (
                        <><StarOff className="h-4 w-4 mr-2" /> Unfeature</>
                      ) : (
                        <><Star className="h-4 w-4 mr-2" /> Feature</>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                    <Button variant="ghost" size="sm" className="text-text-muted">
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
