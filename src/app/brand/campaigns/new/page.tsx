"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CATEGORIES, BOX_SIZES } from "@/lib/utils";

export default function NewCampaignPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "new_launch",
    inventory_count: "",
    box_size: "M" as keyof typeof BOX_SIZES,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); router.push("/brand/campaigns"); }, 1000);
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-4xl mb-2">Launch Campaign</h1>
        <p className="text-text-secondary">Create a new freebie campaign for SA testers.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-5 space-y-4">
          <Input label="Campaign Title" id="title" placeholder="e.g. Rooibos Ice Tea Sampler" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-text-secondary font-medium">Description</label>
            <textarea
              id="description"
              placeholder="Describe the product and what testers will receive..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="h-24 px-4 py-3 border border-border rounded bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 resize-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-text-secondary font-medium">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-11 px-4 border border-border rounded bg-white focus:outline-none focus:border-accent-primary">
                {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <Input label="Stock Count" id="count" type="number" min="1" placeholder="e.g. 100" value={form.inventory_count} onChange={(e) => setForm({ ...form, inventory_count: e.target.value })} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-text-secondary font-medium">PUDO Box Size</label>
            <select value={form.box_size} onChange={(e) => setForm({ ...form, box_size: e.target.value as keyof typeof BOX_SIZES })} className="h-11 px-4 border border-border rounded bg-white focus:outline-none focus:border-accent-primary">
              {Object.entries(BOX_SIZES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <p className="text-xs text-text-muted">Used to calculate PUDO shipping costs.</p>
          </div>
        </Card>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => router.push("/brand/campaigns")} className="flex-1">Cancel</Button>
          <Button type="submit" loading={loading} className="flex-1">Launch Campaign</Button>
        </div>
      </form>
    </main>
  );
}