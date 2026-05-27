"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit3 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function BrandCampaignsPage() {
  const campaigns = [
    {
      id: "1",
      title: "Summer Skincare Set",
      category: "New Launch",
      status: "Active",
      stock: 500,
      claimed: 450,
      createdAt: "2024-05-10",
    },
    {
      id: "2",
      title: "Organic Energy Bar",
      category: "Clearance",
      status: "Active",
      stock: 200,
      claimed: 120,
      createdAt: "2024-05-12",
    },
    {
      id: "3",
      title: "Premium Coffee Pods",
      category: "Out of Season",
      status: "Paused",
      stock: 100,
      claimed: 85,
      createdAt: "2024-05-15",
    },
    {
      id: "4",
      title: "Winter Comfort Box",
      category: "Closing Down",
      status: "Draft",
      stock: 150,
      claimed: 0,
      createdAt: "2024-05-18",
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "success";
      case "paused": return "warning";
      case "draft": return "outline";
      default: return "default";
    }
  };

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
          <Input placeholder="Search campaigns..." className="pl-10" />
        </div>
        <Button variant="secondary">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row md:items-center p-6 gap-6">
                <div className="w-full md:w-24 h-24 rounded-card bg-bg-secondary flex items-center justify-center shrink-0">
                  <div className="w-12 h-12 rounded-subtle bg-accent-primary/20" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-medium text-text-primary truncate">{campaign.title}</h3>
                    <Badge variant={getStatusVariant(campaign.status)}>{campaign.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-text-muted">
                    <span>{campaign.category}</span>
                    <span>•</span>
                    <span>Created on {campaign.createdAt}</span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-text-primary">{campaign.claimed} / {campaign.stock}</p>
                    <div className="w-32 h-1.5 bg-bg-secondary rounded-full mt-1 overflow-hidden">
                      <div 
                        className="h-full bg-accent-primary transition-all duration-500" 
                        style={{ width: `${(campaign.claimed / campaign.stock) * 100}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
