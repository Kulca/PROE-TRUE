"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Info } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";

export default function NewCampaignPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const categories = [
    { value: "new_launch", label: "New Launch" },
    { value: "clearance", label: "Clearance" },
    { value: "out_of_season", label: "Out of Season" },
    { value: "odd_sizing", label: "Odd Sizing" },
    { value: "closing_down", label: "Closing Down Inventory" },
  ];

  const boxSizes = [
    { value: "XS", label: "XS (1-2 small items)" },
    { value: "S", label: "S (Shoebox size)" },
    { value: "M", label: "M (Medium box)" },
    { value: "L", label: "L (Large box)" },
    { value: "XL", label: "XL (Bulk shipment)" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock campaign creation
    setTimeout(() => {
      setIsLoading(false);
      toast("success", "Campaign created successfully!");
      router.push("/brand/campaigns");
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-page">
      <div className="flex items-center gap-4">
        <Link href="/brand/campaigns">
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-serif text-text-primary">New Campaign</h1>
          <p className="text-sm text-text-secondary">Fill in the details to launch your freebie.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Give your campaign a title and description that will appeal to testers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input label="Campaign Title" placeholder="e.g. Summer Skincare Trial Kit" required />
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">Description</label>
                <textarea 
                  className="flex min-h-[120px] w-full rounded-subtle border border-border bg-white px-3 py-2 text-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:border-accent-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                  placeholder="Tell testers about what they're getting and why you're sharing it..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary">Category</label>
                  <select className="flex h-11 w-full rounded-subtle border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:border-accent-primary">
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <Input label="Inventory Count" type="number" placeholder="500" min="1" required />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text-secondary">PUDO Box Size Required</label>
                  <div className="flex items-center gap-1 text-xs text-accent-secondary">
                    <Info className="h-3 w-3" />
                    <span>View size guide</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {boxSizes.map((size) => (
                    <label key={size.value} className="flex items-center gap-3 p-3 rounded-card border border-border hover:border-accent-primary transition-colors cursor-pointer group">
                      <input type="radio" name="boxSize" value={size.value} className="accent-accent-primary" required />
                      <span className="text-sm font-medium text-text-primary group-hover:text-accent-primary transition-colors">{size.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 pt-6 border-t border-border">
              <Link href="/brand/campaigns">
                <Button variant="secondary" type="button">Cancel</Button>
              </Link>
              <Button type="submit" isLoading={isLoading}>Launch Campaign</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
