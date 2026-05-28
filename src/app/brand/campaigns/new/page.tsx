"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  Info, 
  Sparkles,
  Layout
} from "lucide-react";
import { useToast } from "@/components/ui/toast";
import { Checkbox } from "@/components/ui/checkbox";

export default function NewCampaignPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createCampaign = useMutation(api.campaigns.create);
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    category: "new_launch",
    inventory_count: 100,
    boxSize: "S",
    story: "",
    billboard_opt_in: false,
  });

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

    try {
      // In a real app, we'd get the current user's ID from an auth context
      // For this MVP task, we'll try to find a brand user or use a dummy ID
      // assuming the backend developer will wire up the actual auth.
      const userId = "jd72b49v0k5a5e3r6v6m4j7n816mf7v6" as any; // Dummy ID

      await createCampaign({
        brand_id: userId,
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        inventory_count: Number(formData.inventory_count),
        pudo_box_size_required: formData.boxSize as any,
        story: formData.story,
        billboard_opt_in: formData.billboard_opt_in,
      });

      toast({
        title: "Campaign Launched!",
        description: "Your freebie is now live on the marketplace.",
        variant: "success",
      });
      router.push("/brand/campaigns");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
        <Card className="border-border/50 shadow-lg">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="font-serif">Campaign Details</CardTitle>
              <CardDescription>Give your campaign a title and description that will appeal to testers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Input 
                label="Campaign Title" 
                placeholder="e.g. Summer Skincare Trial Kit" 
                required 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-secondary">Description</label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-subtle border border-border bg-white px-3 py-2 text-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:border-accent-primary transition-all"
                  placeholder="Tell testers about what they're getting and why you're sharing it..."
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary">Category</label>
                  <select 
                    className="flex h-11 w-full rounded-subtle border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:border-accent-primary"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <Input 
                  label="Inventory Count" 
                  type="number" 
                  placeholder="100" 
                  min="1" 
                  required 
                  value={formData.inventory_count}
                  onChange={(e) => setFormData({ ...formData, inventory_count: Number(e.target.value) })}
                />
              </div>

              {/* Story Field */}
              <div className="space-y-1.5 p-4 rounded-card bg-accent-primary/5 border border-accent-primary/10">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4 text-accent-primary" />
                  <label className="text-sm font-bold text-text-primary">Campaign Story (Optional)</label>
                </div>
                <textarea
                  className="flex min-h-[80px] w-full rounded-subtle border border-border bg-white/50 px-3 py-2 text-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary transition-all italic"
                  placeholder="Share a short, catchy story about this product... (Featured in carousels)"
                  value={formData.story}
                  onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                />
              </div>

              {/* Billboard Opt-in */}
              <div className="flex items-start space-x-3 p-4 rounded-card border border-border bg-bg-secondary/50">
                <div className="pt-0.5">
                  <input
                    type="checkbox"
                    id="billboard_opt_in"
                    className="w-4 h-4 rounded border-border text-accent-primary focus:ring-accent-primary"
                    checked={formData.billboard_opt_in}
                    onChange={(e) => setFormData({ ...formData, billboard_opt_in: e.target.checked })}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <label htmlFor="billboard_opt_in" className="text-sm font-bold text-text-primary flex items-center gap-2">
                    <Layout className="h-4 w-4" />
                    Billboard Placement Opt-in
                  </label>
                  <p className="text-xs text-text-muted">
                    Check this to allow your campaign to be featured in high-visibility billboard carousels across the platform.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-text-secondary">PUDO Box Size Required</label>
                  <div className="flex items-center gap-1 text-xs text-accent-secondary cursor-pointer hover:underline">
                    <Info className="h-3 w-3" />
                    <span>View size guide</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {boxSizes.map((size) => (
                    <label 
                      key={size.value} 
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-card border transition-all cursor-pointer group",
                        formData.boxSize === size.value 
                          ? "border-accent-primary bg-accent-primary/5 ring-1 ring-accent-primary" 
                          : "border-border hover:border-accent-primary/50"
                      )}
                    >
                      <input 
                        type="radio" 
                        name="boxSize" 
                        value={size.value} 
                        className="accent-accent-primary" 
                        required 
                        checked={formData.boxSize === size.value}
                        onChange={(e) => setFormData({ ...formData, boxSize: e.target.value })}
                      />
                      <span className={cn(
                        "text-sm font-medium transition-colors",
                        formData.boxSize === size.value ? "text-accent-primary" : "text-text-primary"
                      )}>
                        {size.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-3 pt-6 border-t border-border">
              <Link href="/brand/campaigns">
                <Button variant="secondary" type="button">Cancel</Button>
              </Link>
              <Button type="submit" isLoading={isLoading} className="px-8">Launch Campaign</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
