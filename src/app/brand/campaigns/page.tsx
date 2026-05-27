"use client";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/utils";

const CAMPAIGNS = [
  { id: "1", title: "Rooibos Ice Tea Sampler", category: "new_launch", inventory: 142, claimed: 58, status: "active" },
  { id: "2", title: "Biltong Spice Mix", category: "clearance", inventory: 28, claimed: 22, status: "active" },
  { id: "3", title: "Mango Chutney Pack", category: "out_of_season", inventory: 0, claimed: 67, status: "ended" },
];

export default function CampaignsPage() {
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl mb-1">Campaigns</h1>
          <p className="text-text-secondary">Manage your freebie campaigns</p>
        </div>
        <Link href="/brand/campaigns/new">
          <Button>+ New Campaign</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {CAMPAIGNS.map((c) => (
          <Card key={c.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-serif text-lg">{c.title}</h3>
                  <Badge variant={c.status === "active" ? "success" : "default"}>{c.status}</Badge>
                  <Badge variant="secondary">{CATEGORIES[c.category as keyof typeof CATEGORIES]}</Badge>
                </div>
                <p className="text-sm text-text-secondary">{c.claimed} of {c.inventory} claimed</p>
              </div>
              <div className="flex gap-2">
                <div className="w-32 h-2 bg-bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-accent-primary rounded-full" style={{ width: `${(c.claimed / c.inventory) * 100}%` }} />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}